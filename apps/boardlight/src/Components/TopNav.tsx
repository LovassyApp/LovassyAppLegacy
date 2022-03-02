import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    MdOutlineSecurity,
    MdOutlineStore,
    MdOutlineGrade,
    MdOutlineProductionQuantityLimits,
    // MdOutlineSettings,
    MdOutlineRequestPage,
    MdOutlinePeopleAlt,
    MdOutlineHome,
    MdOutlineAttachMoney,
    MdOutlineInventory2,
    MdQrCode2,
} from 'react-icons/md';
import { useTheme } from '@nextui-org/react';
import useLogout from '../Hooks/useLogout';
import { RootState } from '../State';
import Middleware from '../Helpers/Middleware';

const TopNav = (): JSX.Element => {
    const history = useHistory();
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const state: RootState = useSelector<RootState>((state) => state) as RootState;
    const theme = useTheme();
    const dispatch = useDispatch();

    const logout = useLogout();

    return (
        <div>
            <Navbar
                sticky="top"
                light={theme.type === 'light'}
                dark={theme.type === 'dark'}
                className={theme.type === 'dark' ? 'blur-dark' : 'blur'}
                expand="xl">
                <NavbarBrand
                    href="#"
                    onClick={() => {
                        history.push('/');
                    }}>
                    LovassyAPP
                </NavbarBrand>
                <NavbarToggler onClick={() => setIsOpen(!isOpen)} />
                <Collapse isOpen={isOpen} navbar={true}>
                    <Nav className="me-auto" navbar={true}>
                        {/* <Middleware
                            component={
                                <NavItem>
                                    <NavLink
                                        href="#"
                                        active={history.location.pathname === '/home'}
                                        onClick={() => {
                                            history.push('/home');
                                        }}>
                                        <MdOutlineHome className="mb-1" />
                                        <span className="ml-4"> Home</span>
                                    </NavLink>
                                </NavItem>
                            }
                            permission="General.home"
                            displayError={false}
                        /> */}

                        <Middleware
                            component={
                                <NavItem>
                                    <NavLink
                                        href="#"
                                        active={history.location.pathname === '/home'}
                                        onClick={() => {
                                            history.push('/home');
                                        }}>
                                        <MdOutlineInventory2 className="mb-1" />
                                        <span className="ml-4"> Kincstár</span>
                                    </NavLink>
                                </NavItem>
                            }
                            permission="Inventory.view"
                            displayError={false}
                        />

                        <Middleware
                            component={
                                <NavItem>
                                    <NavLink
                                        href="#"
                                        active={history.location.pathname === '/grades'}
                                        onClick={() => {
                                            history.push('/grades');
                                        }}>
                                        <MdOutlineGrade className="mb-1" />
                                        <span className="ml-4"> Jegyek</span>
                                    </NavLink>
                                </NavItem>
                            }
                            permission="General.grades"
                            displayError={false}
                        />

                        <Middleware
                            component={
                                <NavItem>
                                    <NavLink
                                        href="#"
                                        active={history.location.pathname === '/lolo'}
                                        onClick={() => {
                                            history.push('/lolo');
                                        }}>
                                        <MdOutlineAttachMoney className="mb-1" />
                                        <span className="ml-4"> LoLó</span>
                                    </NavLink>
                                </NavItem>
                            }
                            permission="General.lolo"
                            displayError={false}
                        />

                        <Middleware
                            component={
                                <NavItem>
                                    <NavLink
                                        href="#"
                                        active={history.location.pathname === '/store'}
                                        onClick={() => {
                                            history.push('/store');
                                        }}>
                                        <MdOutlineStore className="mb-1" />
                                        <span className="ml-4"> Bazár</span>
                                    </NavLink>
                                </NavItem>
                            }
                            permission="Store.view"
                            displayError={false}
                        />

                        {/* Admin section, permissionök kellenek */}
                        <Middleware
                            component={
                                <NavItem>
                                    <NavLink
                                        href="#"
                                        active={history.location.pathname === '/admin/products'}
                                        onClick={() => {
                                            history.push('/admin/products');
                                        }}>
                                        <MdOutlineProductionQuantityLimits className="mb-1" />
                                        <span className="ml-4"> Termékek</span>
                                    </NavLink>
                                </NavItem>
                            }
                            permission="Products.index"
                            displayError={false}
                        />

                        <Middleware
                            component={
                                <NavItem>
                                    <NavLink
                                        href="#"
                                        active={history.location.pathname === '/admin/requests'}
                                        onClick={() => {
                                            history.push('/admin/requests');
                                        }}>
                                        <MdOutlineRequestPage className="mb-1" />
                                        <span className="ml-4"> Kérvények</span>
                                    </NavLink>
                                </NavItem>
                            }
                            permission="Requests.index"
                            displayError={false}
                        />

                        <Middleware
                            component={
                                <NavItem>
                                    <NavLink
                                        href="#"
                                        active={history.location.pathname === '/admin/qrcodes'}
                                        onClick={() => {
                                            history.push('/admin/qrcodes');
                                        }}>
                                        <MdQrCode2 className="mb-1" />
                                        <span className="ml-4"> QR-kódok</span>
                                    </NavLink>
                                </NavItem>
                            }
                            permission="QRCode.view"
                            displayError={false}
                        />
                        <Middleware
                            component={
                                <NavItem>
                                    <NavLink
                                        href="#"
                                        active={history.location.pathname === '/admin/users'}
                                        onClick={() => {
                                            history.push('/admin/users');
                                        }}>
                                        <MdOutlinePeopleAlt className="mb-1" />
                                        <span className="ml-4"> Felhasználók</span>
                                    </NavLink>
                                </NavItem>
                            }
                            permission="Users.view"
                            displayError={false}
                        />
                        <Middleware
                            component={
                                <NavItem>
                                    <NavLink
                                        href="#"
                                        active={history.location.pathname === '/admin/permissions'}
                                        onClick={() => {
                                            history.push('/admin/permissions');
                                        }}>
                                        <MdOutlineSecurity className="mb-1" />
                                        <span className="ml-4"> Jogosultságok</span>
                                    </NavLink>
                                </NavItem>
                            }
                            permission="Permissions.view"
                            displayError={false}
                        />

                        {/* <NavItem>
                            <NavLink
                                href="#"
                                active={history.location.pathname === '/admin/settings'}
                                onClick={() => {
                                    history.push('/admin/settings');
                                }}
                            >
                                <MdOutlineSettings className="mb-1" />
                                <span className="ml-4"> Rendszerbeállítások</span>
                            </NavLink>
                            </NavItem>*/}
                    </Nav>
                    <Nav navbar={true}>
                        <UncontrolledDropdown inNavbar={true}>
                            <DropdownToggle caret={true} nav={true}>
                                {state.control.control.user !== null
                                    ? state.control.control.user.name
                                    : ''}
                            </DropdownToggle>
                            <DropdownMenu
                                dark={theme.type === 'dark'}
                                style={{
                                    borderRadius: 10,
                                    background:
                                        theme.type === 'dark'
                                            ? theme.palette.background
                                            : theme.palette.accents_1,
                                    zIndex: '5',
                                }}
                                end={true}>
                                <DropdownItem
                                    onClick={() =>
                                        dispatch({ type: 'settingsModal/openSettingsModal' })
                                    }>
                                    Beállítások
                                </DropdownItem>
                                <DropdownItem divider={true} />
                                <DropdownItem onClick={logout}>Kijelentkezés</DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </Nav>
                </Collapse>
            </Navbar>
        </div>
    );
};

export default TopNav;
