import { Badge, Card, CardBody, Col, Container, Row } from "reactstrap";
import { Button, useTheme } from "@nextui-org/react";
import { MdAdd, MdCheck, MdClose } from "react-icons/md";

import AuthLayout from "../../Layouts/Auth";
import DataTable from "react-data-table-component";
import EmptyTable from "../../Components/EmptyTable";
import HeaderCard from "../../Components/HeaderCard";
import InputRenderer from "../../Components/InputRenderer";
import MDEditor from "@uiw/react-md-editor";
import React from "react";
import TableLoader from "../../Components/TableLoader";
import deleteModal from "../../Utils/DeleteModal";
import { deleteProduct } from "../../Helpers/ProductHelper";
import toast from "react-hot-toast";
import useBlueboardClient from "../../Hooks/useBlueboardClient";
import { useHistory } from "react-router";

const Expand = ({ data }) => {
  return (
    <div className="my-2 mx-2">
      <Row>
        <div className="col-auto">
          <img src={data.imageUrl} height={200} alt="Product image" />
        </div>

        <div className="col-auto">
          <MDEditor.Markdown source={data.markdownContent} />
          <InputRenderer inputs={JSON.parse(data.inputs)} />
        </div>
      </Row>
    </div>
  );
};

const Products = () => {
  const theme = useTheme();
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const history = useHistory();
  const client = useBlueboardClient();

  const bootstrap = async () => {
    setLoading(true);
    client.products
      .all()
      .then((res) => {
        setProducts(res);
        setLoading(false);
      })
      .catch((err) => toast.error(err.message));
  };

  React.useEffect(() => {
    bootstrap();
  }, []);

  const deleteRow = async (row) => {
    const res = await deleteModal(
      "Biztos, hogy törölni szeretnéd ezt a terméket?",
      "Törlés - " + row.name,
      theme
    );

    if (res.isConfirmed) {
      toast.promise(
        deleteProduct(row.id).then(() => bootstrap()),
        {
          loading: "Törlés...",
          success: "Sikeresen törölve!",
          error: "Hiba történt!",
        }
      );
    }
  };

  const editEl = async (id) => {
    history.push("/admin/products/edit/" + id);
  };

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      maxWidth: "10px",
    },
    {
      name: "Név",
      selector: (row) => row.name,
    },
    {
      name: "Rövid leírás",
      selector: (row) => row.description,
      wrap: true,
    },
    {
      name: "Kód kell?",
      cell: (row) => {
        return Boolean(row.codeActivated) ? (
          <MdCheck fontSize={20} />
        ) : (
          <MdClose fontSize={20} />
        );
      },
      maxWidth: "10px",
    },
    {
      name: "Látható a bazárban?",
      cell: (row) => {
        return Boolean(row.visible) ? (
          <MdCheck fontSize={20} />
        ) : (
          <MdClose fontSize={20} />
        );
      },
    },
    {
      name: "Ár (LoLó)",
      selector: (row) => row.price,
      maxWidth: "10px",
    },
    {
      name: "Mennyiség",
      selector: (row) => row.quantity,
      maxWidth: "10px",
    },
    {
      name: "Aktiváló kódok",
      cell: (row) => (
        <div>
          {row.codes.length == 0 ? (
            <i>Itt nincs semmi.</i>
          ) : (
            row.codes.map((el, key) => (
              <Badge key={key} className="badge-white m-1">
                {el.name}
              </Badge>
            ))
          )}
        </div>
      ),
      wrap: true,
    },
    {
      name: "",
      cell: (el) => {
        return (
          <>
            <Button
              className="mx-1"
              auto
              rounded
              color="primary"
              onClick={() => editEl(el.id)}
            >
              Szerkesztés
            </Button>
            <Button
              className="mx-1"
              auto
              rounded
              color="error"
              onClick={() => deleteRow(el)}
            >
              Törlés
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <AuthLayout>
      <HeaderCard title="Termékek" />
      <Container fluid style={{ width: "95%" }}>
        <Row className="ml-2 mr-2">
          <Col md="12">
            <Card
              style={{
                background:
                  theme.type == "dark"
                    ? theme.palette.accents_1
                    : theme.palette.background,
              }}
            >
              <CardBody style={{ height: "calc(100vh - 320px)" }}>
                <DataTable
                  highlightOnHover
                  pointerOnHover
                  columns={columns}
                  data={products}
                  theme={theme.type}
                  progressPending={loading}
                  progressComponent={<TableLoader />}
                  noDataComponent={<EmptyTable />}
                  expandableRows
                  expandOnRowClicked
                  fixedHeader
                  fixedHeaderScrollHeight="calc(100vh - 350px)"
                  expandableRowsComponent={Expand}
                />
              </CardBody>
            </Card>
          </Col>
          <div className="mt-2"></div>
          <center>
            <Button
              color="gradient"
              rounded
              onClick={() => history.push("/admin/products/edit/new")}
            >
              <MdAdd />
              Termék hozzáadása
            </Button>
          </center>
        </Row>
      </Container>
    </AuthLayout>
  );
};

export default Products;
