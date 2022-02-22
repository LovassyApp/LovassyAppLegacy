import Swal, { SweetAlertResult } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Button, NextUIThemes } from "@nextui-org/react";
import { BlueboardInventoryItem } from "blueboard-client";

const ReactSwal = withReactContent(Swal);

const itemUsedModalFresh = async (
    item: BlueboardInventoryItem,
    theme: NextUIThemes,
): Promise<SweetAlertResult<any>> => {
    return ReactSwal.fire({
        title: `<div style="color: ${theme.palette.text}">Termék sikeresen beváltva!</div>`,
        background: theme.type === "dark" ? theme.palette.accents_1 : theme.palette.background,
        icon: "success",
        html: (
            <>
                <h4 style={{ color: theme.palette.text }}>
                    {item.product.name} - Tárgy #{item.id}
                </h4>
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

export default itemUsedModalFresh;
