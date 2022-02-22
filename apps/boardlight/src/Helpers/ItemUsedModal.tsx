import Swal, {SweetAlertResult} from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {Button, NextUIThemes} from "@nextui-org/react";
import {BlueboardInventoryItem} from "blueboard-client";
import {Badge, Col, Row} from "reactstrap";

const ReactSwal = withReactContent(Swal);

const itemUsedModal = async (
    item: BlueboardInventoryItem,
    theme: NextUIThemes,
): Promise<SweetAlertResult<any>> => {
    return ReactSwal.fire({
        title: `<div class="p-0 m-0" style="color: ${theme.palette.text}">Termék beváltva</div>`,
        background: theme.type === "dark" ? theme.palette.accents_1 : theme.palette.background,
        icon: "info",
        html: (
            <>
                <h4 style={{color: theme.palette.text}}>
                    {item.product.name} - Tárgy #{item.id}
                </h4>
                <p style={{color: theme.palette.text}}>Beváltás dátuma: {item.usedAt}</p>
                {item.itemUse ? (
                    <>
                        <div
                            className="dropdown-divider"
                            style={{background: theme.palette.accents_2}}
                        />
                        <div className="mt-3" style={{color: theme.palette.text, width: "95%"}}>
                            {item.product.inputs.map((el, key) => (
                                <Row key={key} className="mt-2">
                                    <Col md="auto">{el.title}: </Col>
                                    <Col>
                                        {" "}
                                        {el.type === "boolean" ? (
                                            <Badge
                                                pill={true}
                                                color={
                                                    (item.itemUse?.values[el.name] as boolean) ===
                                                    true
                                                        ? "success"
                                                        : "error"
                                                }>
                                                {" "}
                                                {(item.itemUse?.values[el.name] as boolean) === true
                                                    ? "Igen"
                                                    : "Nem"}{" "}
                                            </Badge>
                                        ) : (
                                            item.itemUse?.values[el.name]
                                        )}
                                    </Col>
                                </Row>
                            ))}
                        </div>
                    </>
                ) : (
                    <></>
                )}
                <Button
                    className="mt-4"
                    type="button"
                    role="button"
                    tabIndex={0}
                    auto={true}
                    rounded={true}
                    flat={true}
                    color="success"
                    onClick={() => {
                        ReactSwal.clickConfirm();
                    }}>
                    OK
                </Button>
            </>
        ),
        showCancelButton: false,
        showConfirmButton: false,
    });
};

export default itemUsedModal;
