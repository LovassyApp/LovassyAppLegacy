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
	MdSecurity,
	MdOutlineStore,
	MdOutlineGrade,
	MdOutlineProductionQuantityLimits,
	MdOutlineSettings,
	MdOutlinePeopleAlt,
	MdOutlineHome,
	MdOutlineAttachMoney,
	MdOutlineInventory2,
	MdQrCode2,
} from 'react-icons/md';
import { useTheme } from '@nextui-org/react';
import useLogout from '../Hooks/useLogout';

const TopNav = () => {
	const history = useHistory();
	const [isOpen, setIsOpen] = React.useState(false);
	const state = useSelector((state) => state);
	const theme = useTheme();
	const dispatch = useDispatch();

	const logout = useLogout();

	const toggle = () => setIsOpen(!isOpen);

	return (
		<div>
			<Navbar
				sticky="top"
				light={theme.type == 'light'}
				dark={theme.type == 'dark'}
				className={theme.type == 'dark' ? 'blur-dark' : 'blur'}
				expand="xl"
			>
				<NavbarBrand
					href="#"
					onClick={() => {
						history.push('/');
					}}
				>
					LovassyAPP
				</NavbarBrand>
				<NavbarToggler onClick={toggle} />
				<Collapse isOpen={isOpen} navbar>
					<Nav className="me-auto" navbar>
						<NavItem>
							<NavLink
								href="#"
								active={history.location.pathname === '/home'}
								onClick={() => {
									history.push('/home');
								}}
							>
								<MdOutlineHome className="mb-1" />
								<span className="ml-4"> Home</span>
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink
								href="#"
								active={history.location.pathname === '/grades'}
								onClick={() => {
									history.push('/grades');
								}}
							>
								<MdOutlineGrade className="mb-1" />
								<span className="ml-4"> Jegyek</span>
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink
								href="#"
								active={history.location.pathname === '/lolo'}
								onClick={() => {
									history.push('/lolo');
								}}
							>
								<MdOutlineAttachMoney className="mb-1" />
								<span className="ml-4"> LoLó</span>
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink
								href="#"
								active={history.location.pathname === '/store'}
								onClick={() => {
									history.push('/store');
								}}
							>
								<MdOutlineStore className="mb-1" />
								<span className="ml-4"> Bazár</span>
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink
								href="#"
								active={history.location.pathname === '/inventory'}
								onClick={() => {
									history.push('/inventory');
								}}
							>
								<MdOutlineInventory2 className="mb-1" />
								<span className="ml-4"> Kincstár</span>
							</NavLink>
						</NavItem>

						{/* Admin section, permissionök kellenek */}

						<NavItem>
							<NavLink
								href="#"
								active={history.location.pathname === '/admin/products'}
								onClick={() => {
									history.push('/admin/products');
								}}
							>
								<MdOutlineProductionQuantityLimits className="mb-1" />
								<span className="ml-4"> Termékek</span>
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink
								href="#"
								active={history.location.pathname === '/admin/qrcodes'}
								onClick={() => {
									history.push('/admin/qrcodes');
								}}
							>
								<MdQrCode2 className="mb-1" />
								<span className="ml-4"> QR-kódok</span>
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink
								href="#"
								active={history.location.pathname === '/admin/users'}
								onClick={() => {
									history.push('/admin/users');
								}}
							>
								<MdOutlinePeopleAlt className="mb-1" />
								<span className="ml-4"> Felhasználók</span>
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink
								href="#"
								active={history.location.pathname === '/admin/permissions'}
								onClick={() => {
									history.push('/admin/permissions');
								}}
							>
								<MdSecurity className="mb-1" />
								<span className="ml-4"> Jogosultságok</span>
							</NavLink>
						</NavItem>
						<NavItem>
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
						</NavItem>
					</Nav>
					<Nav navbar>
						<UncontrolledDropdown inNavbar>
							<DropdownToggle caret nav>
								{state.control.control != null ? state.control.control.user.name : ''}
							</DropdownToggle>
							<DropdownMenu
								dark={theme.type == 'dark'}
								style={{
									borderRadius: 10,
									background:
										theme.type == 'dark' ? theme.palette.background : theme.palette.accents_1,
									zIndex: '5',
								}}
								end
							>
								<DropdownItem
									onClick={() => {
										dispatch({ type: 'theme/toggle' });
									}}
								>
									{theme.type == 'dark' ? 'Világos mód' : 'Sötét mód'}
								</DropdownItem>
								<DropdownItem>Option 2</DropdownItem>
								<DropdownItem divider />
								<DropdownItem onClick={logout}>Logout</DropdownItem>
							</DropdownMenu>
						</UncontrolledDropdown>
					</Nav>
				</Collapse>
			</Navbar>
		</div>
	);
};

export default TopNav;
