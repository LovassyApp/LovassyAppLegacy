import * as React from "react";

import { Alert, Card, CardBody, Col, Row } from "reactstrap";
import { Button, Input, Loading, useTheme } from "@nextui-org/react";
import { useHistory, useParams } from "react-router";

import AuthLayout from "../../Layouts/Auth";
import { BlueboardNotFoundException } from "blueboard-client";
import { Container } from "@nextui-org/react";
import HeaderCard from "../../Components/HeaderCard";
import Select from "react-select";
import TableLoader from "../../Components/TableLoader";
import makeAnimated from "react-select/animated";
import toast from "react-hot-toast";
import useBlueboardClient from "../../Hooks/useBlueboardClient";

const animatedComponents = makeAnimated();

const EditUser = () => {
  const { id } = useParams();
  const history = useHistory();
  const theme = useTheme();
  const client = useBlueboardClient();

  if (isNaN(Number(id))) {
    history.push("/404");
  }

  const [loading, setLoading] = React.useState(true);
  const [savePending, setSavePending] = React.useState(false);

  const [allGroups, setAllGroups] = React.useState([]);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [groups, setGroups] = React.useState([]);

  const [GLOBERR, setGLOBERR] = React.useState("");
  const [nameErr, setNameErr] = React.useState([]);
  const [emailErr, setEmailErr] = React.useState([]);

  const [globIsVisible, globSetVisible] = React.useState(false);
  const [nameIsVisible, nameSetVisible] = React.useState(false);
  const [emailIsVisible, emailSetVisible] = React.useState(false);

  const onDismiss = () => globSetVisible(false);

  React.useEffect(() => {
    client.users
      .get(id)
      .then((user) => {
        setName(user.name);
        setEmail(user.email);
        setGroups(user.groups.map((el) => ({ value: el.id, label: el.name })));

        client.groups
          .all()
          .then((res) => {
            setAllGroups(res.map((el) => ({ value: el.id, label: el.name })));
            setLoading(false);
          })
          .catch((err) => toast.error(err.message));
      })
      .catch((err) => {
        if (err instanceof BlueboardNotFoundException) {
          history.push("/404");
        } else {
          toast.error(err.message);
        }
      });
  }, []);

  const trySave = () => {
    const data = {
      id: id,
      name: name,
      email: email,
      groups: groups.map((group) => group.value ?? group),
    };

    setSavePending(true);
    client.users
      .save(data)
      .then((res) => {
        toast.success("Sikeres mentés!");
        history.push("/admin/users");
      })
      .catch((err) => {
        setSavePending(false);
        if (err.errors) {
          if (err.errors.name != null) {
            setNameErr(err.errors.name);
            nameSetVisible(true);
          }
          if (err.errors.email != null) {
            setEmailErr(err.errors.email);
            emailSetVisible(true);
          }
        } else {
          setGLOBERR(err.message);
          globSetVisible(true);
        }
      });
  };

  return (
    <AuthLayout>
      <HeaderCard
        title={loading ? <Loading color="white" /> : "Felhasználó: " + name}
      />
      {loading ? (
        <center>
          <TableLoader />
        </center>
      ) : (
        <div className="mx-2 mt-2">
          <center>
            <Card
              style={{
                background:
                  theme.type == "dark"
                    ? theme.palette.accents_1
                    : theme.palette.background,
                width: "95%",
              }}
            >
              <CardBody>
                <Container gap={0}>
                  <Row>
                    <Col lg="6">
                      <Input
                        fullWidth
                        className="mt-2"
                        clearable
                        bordered
                        underlined
                        color={name === "" ? "error" : "primary"}
                        shadow={false}
                        onChange={(e) => setName(e.target.value)}
                        labelLeft="Név: "
                        initialValue={name}
                      />
                      <Alert
                        className="mt-2"
                        color="danger"
                        isOpen={nameIsVisible}
                        toggle={() => nameSetVisible(false)}
                      >
                        {nameErr.map((el) => (
                          <span>
                            {" "}
                            {el} <br />{" "}
                          </span>
                        ))}
                      </Alert>
                    </Col>
                    <Col lg="6">
                      <Input
                        fullWidth
                        className="mt-2"
                        clearable
                        bordered
                        underlined
                        color={email === "" ? "error" : "primary"}
                        shadow={false}
                        onChange={(e) => setEmail(e.target.value)}
                        labelLeft="Email: "
                        initialValue={email}
                      />
                      <Alert
                        className="mt-2"
                        color="danger"
                        isOpen={emailIsVisible}
                        toggle={() => emailSetVisible(false)}
                      >
                        {emailErr.map((el) => (
                          <span>
                            {" "}
                            {el} <br />{" "}
                          </span>
                        ))}
                      </Alert>
                    </Col>
                  </Row>
                  <Row className="align-items-center">
                    <Col lg="1" md="2">
                      <div className="align-text-middle">Csoportok:</div>
                    </Col>
                    <Col lg="11" md="10">
                      <Select
                        components={animatedComponents}
                        closeMenuOnSelect={false}
                        defaultValue={groups}
                        isMulti
                        theme={(dropTheme) => {
                          return {
                            ...dropTheme,
                            borderRadius: 4,
                            colors: {
                              ...dropTheme.colors,
                              primary: theme.palette.primary,
                              primary25: theme.palette.primary,
                              primary50: theme.palette.primary,
                              primary75: theme.palette.primary,
                              danger: theme.palette.errorDark,
                              dangerLight: theme.palette.secondary,
                              neutral0: theme.palette.accents_1,
                              neutral10: theme.palette.accents_2,
                              neutral20: theme.palette.accents_2,
                              neutral30: theme.palette.accents_3,
                              neutral40: theme.palette.accents_4,
                              neutral50: theme.palette.accents_5,
                              neutral60: theme.palette.accents_6,
                              neutral70: theme.palette.accents_7,
                              neutral80: theme.palette.accents_8,
                              neutral90: theme.palette.accents_8,
                            },
                          };
                        }}
                        options={allGroups}
                        className="mt-2"
                        onChange={(e) => setGroups(e.map((e) => e.value))}
                      />
                    </Col>
                  </Row>
                </Container>

                <Alert
                  color="danger"
                  className="mt-2"
                  isOpen={globIsVisible}
                  toggle={onDismiss}
                >
                  <h4 className="alert-heading">Hoppácska!</h4>
                  <p>{GLOBERR}</p>
                </Alert>
                <center>
                  <Button
                    auto
                    className="mt-2"
                    loading={savePending}
                    loaderType="points"
                    color="gradient"
                    rounded
                    onClick={trySave}
                  >
                    Mentés
                  </Button>
                </center>
              </CardBody>
            </Card>
          </center>
        </div>
      )}
    </AuthLayout>
  );
};

export default EditUser;
