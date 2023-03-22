import React, { useState, useEffect } from "react";
import { Typography, Input, Modal, Button, Space, Table, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import styles from "./index.module.less";
import { PlusOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { user } from "../../api/index";
import { dateFormat } from "../../utils/index";
import { Link, useNavigate } from "react-router-dom";
import { TreeDepartment, PerButton } from "../../compenents";
import { MemberCreate } from "./compenents/create";
import { MemberUpdate } from "./compenents/update";
const { confirm } = Modal;

interface DataType {
  id: React.Key;
  name: string;
  email: string;
  created_at: string;
  credit1: number;
  id_card: string;
  is_lock: number;
}

export const MemberPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [list, setList] = useState<any>([]);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);

  const [nickname, setNickname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [id_card, setIdCard] = useState<string>("");
  const [dep_ids, setDepIds] = useState<any>([]);
  const [selLabel, setLabel] = useState<string>("全部部门");
  const [createVisible, setCreateVisible] = useState<boolean>(false);
  const [updateVisible, setUpdateVisible] = useState<boolean>(false);
  const [mid, setMid] = useState<number>(0);

  const columns: ColumnsType<DataType> = [
    {
      title: "ID",
      key: "id",
      dataIndex: "id",
    },
    {
      title: "姓名",
      dataIndex: "name",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "邮箱",
      dataIndex: "email",
    },
    {
      title: "身份证号",
      dataIndex: "id_card",
    },
    {
      title: "注册时间",
      dataIndex: "created_at",
      render: (text: string) => <span>{dateFormat(text)}</span>,
    },
    {
      title: "操作",
      key: "action",
      fixed: "right",
      width: 160,
      render: (_, record: any) => (
        <Space size="small">
          <PerButton
            type="link"
            text="编辑"
            class="b-link c-red"
            icon={null}
            p="user-update"
            onClick={() => {
              setMid(Number(record.id));
              setUpdateVisible(true);
            }}
            disabled={null}
          />
          <div className="form-column"></div>
          <PerButton
            type="link"
            text="删除"
            class="b-link c-red"
            icon={null}
            p="user-destroy"
            onClick={() => delUser(record.id)}
            disabled={null}
          />
        </Space>
      ),
    },
  ];

  useEffect(() => {
    getData();
  }, [refresh, page, size, dep_ids]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const getData = () => {
    let depIds = dep_ids.join(",");
    setLoading(true);
    user
      .userList(page, size, {
        name: nickname,
        email: email,
        id_card: id_card,
        dep_ids: depIds,
      })
      .then((res: any) => {
        setList(res.data.data);
        setTotal(res.data.total);
        setLoading(false);
        setSelectedRowKeys([]);
      });
  };

  const resetData = () => {
    setNickname("");
    setEmail("");
    setIdCard("");
    setPage(1);
    setSize(10);
    setList([]);
    setRefresh(!refresh);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const paginationProps = {
    current: page, //当前页码
    pageSize: size,
    total: total, // 总条数
    onChange: (page: number, pageSize: number) =>
      handlePageChange(page, pageSize), //改变页码的函数
    showSizeChanger: true,
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPage(page);
    setSize(pageSize);
  };

  const delUser = (id: number) => {
    if (id === 0) {
      return;
    }
    confirm({
      title: "操作确认",
      icon: <ExclamationCircleFilled />,
      content: "确认删除此视频？",
      centered: true,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        user.destroyUser(id).then((res: any) => {
          message.success("操作成功");
          setRefresh(!refresh);
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const hasSelected = selectedRowKeys.length > 0;
  return (
    <>
      <div className="tree-main-body">
        <div className="left-box">
          <TreeDepartment
            type=""
            text={"部门"}
            onUpdate={(keys: any, title: any) => {
              setDepIds(keys);
              setLabel(title);
            }}
          />
        </div>
        <div className="right-box">
          <div className="playedu-main-title float-left mb-24">{selLabel}</div>
          <div className="float-left j-b-flex mb-24">
            <div className="d-flex">
              <PerButton
                type="primary"
                text="添加学员"
                class="mr-16"
                icon={<PlusOutlined />}
                p="user-store"
                onClick={() => setCreateVisible(true)}
                disabled={null}
              />
              <Link style={{ textDecoration: "none" }} to={`/member/import`}>
                <PerButton
                  type="primary"
                  text="学员批量导入"
                  class="mr-16"
                  icon={null}
                  p="user-store"
                  onClick={() => null}
                  disabled={null}
                />
              </Link>
            </div>
            <div className="d-flex">
              <div className="d-flex mr-24">
                <Typography.Text>姓名：</Typography.Text>
                <Input
                  value={nickname}
                  onChange={(e) => {
                    setNickname(e.target.value);
                  }}
                  style={{ width: 160 }}
                  placeholder="请输入姓名"
                />
              </div>
              <div className="d-flex mr-24">
                <Typography.Text>邮箱：</Typography.Text>
                <Input
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  style={{ width: 160 }}
                  placeholder="请输入邮箱"
                />
              </div>
              <div className="d-flex mr-24">
                <Typography.Text>身份证号：</Typography.Text>
                <Input
                  value={id_card}
                  onChange={(e) => {
                    setIdCard(e.target.value);
                  }}
                  style={{ width: 160 }}
                  placeholder="请输入身份证号"
                />
              </div>
              <div className="d-flex mr-24">
                <Button className="mr-16" onClick={resetData}>
                  重 置
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    setPage(1);
                    setRefresh(!refresh);
                  }}
                >
                  查 询
                </Button>
              </div>
            </div>
          </div>
          <div className="float-left">
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={list}
              loading={loading}
              pagination={paginationProps}
              rowKey={(record) => record.id}
            />
            <MemberCreate
              open={createVisible}
              onCancel={() => {
                setCreateVisible(false);
                setRefresh(!refresh);
              }}
            />
            <MemberUpdate
              id={mid}
              open={updateVisible}
              onCancel={() => {
                setUpdateVisible(false);
                setRefresh(!refresh);
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};
