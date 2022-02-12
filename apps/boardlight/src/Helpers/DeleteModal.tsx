import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Button, NextUIThemes } from '@nextui-org/react';

const ReactSwal = withReactContent(Swal);

const deleteModal = async (modalText: string, title: string, theme: NextUIThemes) => {
    return ReactSwal.fire({
        title: `<div style="color: ${theme.palette.text}">${title}</div>`,

        background: theme.type === 'dark' ? theme.palette.accents_1 : theme.palette.background,
        icon: 'error',
        html: (
            <>
                <p style={{ color: theme.palette.text }}>{modalText}</p>
                <Button
                    type="button"
                    role="button"
                    tabIndex={0}
                    className="mx-1 mt-4"
                    auto
                    flat
                    rounded
                    color="secondary"
                    onClick={() => {
                        ReactSwal.clickCancel();
                    }}
                >
                    Mégsem
                </Button>
                <Button
                    type="button"
                    role="button"
                    tabIndex={0}
                    className="mx-1 mt-4"
                    auto
                    rounded
                    color="error"
                    onClick={() => {
                        ReactSwal.clickConfirm();
                    }}
                >
                    Törlés
                </Button>
            </>
        ),
        showCancelButton: false,
        showConfirmButton: false,
    });
};

export default deleteModal;
