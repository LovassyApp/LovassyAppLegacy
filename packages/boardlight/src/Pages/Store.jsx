import * as React from "react";

import { Badge, Col, Row } from "reactstrap";
import { Card, Container, Input, Text, useTheme } from "@nextui-org/react";

import AuthLayout from "../Layouts/Auth";
import HeaderCard from "../Components/HeaderCard";
import { useUser } from "../Hooks/ControlHooks";

const Store = () => {
  const theme = useTheme();
  const user = useUser();

  const [loading, setLoading] = React.useState(false);
  const [products, setProducst] = React.useState([]);
  const [isOpen, setOpen] = React.useState(false);
  const [currentProduct, setCurrentProduct] = React.useState({});

  return (
    <AuthLayout>
      <HeaderCard title="Bazár" />
      <Container style={{ width: "95%" }}>
        <Card hoverable>
          <Row>
            <Col md="4" sm="12">
              <Text className="mt-1">
                Jelenlegi egyenleged:{" "}
                <Badge
                  color={
                    user.balance > 0
                      ? user.balance > 2
                        ? "success"
                        : "warning"
                      : "danger"
                  }
                >
                  {user.balance} LoLó
                </Badge>
              </Text>
            </Col>
            <Col md="4" sm="0"></Col>
            <Col md="4" sm="12">
              <Input
                fullWidth
                clearable
                bordered
                underlined
                shadow={false}
                labelLeft="Filter"
              />
            </Col>
          </Row>
        </Card>
      </Container>
    </AuthLayout>
  );
};

export default Store;
