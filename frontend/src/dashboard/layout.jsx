import React, { useState } from 'react';
import { Container, Navbar, Nav, Offcanvas, Button, Image, Dropdown, Form } from 'react-bootstrap';
import { useAuth } from '../AuthProvider'; // Corrected: Import useAuth from '../AuthProvider'
import {
  HouseDoorFill,
  BarChartFill,
  GridFill,
  Table,
  CircleFill,
  GraphUp,
  PersonFill,
  ExclamationCircleFill,
  FileEarmarkFill,
  BookFill,
  Search,
  BellFill,
  EnvelopeFill,
  GearFill,
  BoxArrowRight,
  ChevronDown,
  ThreeDotsVertical // For the mobile menu toggle
} from 'react-bootstrap-icons';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth(); // 'user' is now used
  const [showSidebar, setShowSidebar] = useState(false);

  const handleCloseSidebar = () => setShowSidebar(false);
  const handleShowSidebar = () => setShowSidebar(true);

  // Determine the display name for the user
  const displayName = user?.username || 'Guest'; // Use user.username if available, otherwise 'Guest'

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      {/* Sidebar for larger screens (fixed width) */}
      <div className="d-none d-lg-block bg-white shadow-sm" style={{ width: '250px', flexShrink: 0 }}>
        <div className="p-3 border-bottom text-center">
          <Image src="/images/Logo_Navbar.png" width={120} alt="Purple Logo" className="my-3" />
        </div>
        <div className="p-3 text-center border-bottom">
          <Image
            src="https://placehold.co/50x50/8a2be2/ffffff?text=DG" // Placeholder for David Grey
            roundedCircle
            className="mb-2"
          />
          <h5 className="mb-0">{displayName}</h5> {/* Display dynamic username */}
          <small className="text-muted">Project Manager</small>
        </div>
        <Nav className="flex-column p-3">
          <Nav.Link href="#" className="text-decoration-none text-dark fw-bold py-2">
            <HouseDoorFill className="me-2" />Dashboard
          </Nav.Link>
          <Nav.Link href="#" className="text-decoration-none text-secondary py-2">
            <BarChartFill className="me-2" />Basic UI Elements
          </Nav.Link>
          <Nav.Link href="#" className="text-decoration-none text-secondary py-2">
            <GridFill className="me-2" />Form Elements
          </Nav.Link>
          <Nav.Link href="#" className="text-decoration-none text-secondary py-2">
            <Table className="me-2" />Tables
          </Nav.Link>
          <Nav.Link href="#" className="text-decoration-none text-secondary py-2">
            <CircleFill className="me-2" />Icons
          </Nav.Link>
          <Nav.Link href="#" className="text-decoration-none text-secondary py-2">
            <GraphUp className="me-2" />Charts
          </Nav.Link>
          <Nav.Link href="#" className="text-decoration-none text-secondary py-2">
            <PersonFill className="me-2" />User Pages
          </Nav.Link>
          <Nav.Link href="#" className="text-decoration-none text-secondary py-2">
            <ExclamationCircleFill className="me-2" />Error Pages
          </Nav.Link>
          <Nav.Link href="#" className="text-decoration-none text-secondary py-2">
            <FileEarmarkFill className="me-2" />General Pages
          </Nav.Link>
          <Nav.Link href="#" className="text-decoration-none text-secondary py-2">
            <BookFill className="me-2" />Documentation
          </Nav.Link>
        </Nav>
      </div>

      {/* Main content wrapper (takes remaining width, scrolls if content overflows) */}
      <div className="flex-grow-1 d-flex flex-column">
        {/* Navbar (Header) - Always at the top of the main content area */}
        <Navbar bg="white" expand="lg" className="shadow-sm p-3">
          <Container fluid>
            {/* Toggle for smaller screens */}
            <Button variant="link" onClick={handleShowSidebar} className="d-lg-none p-0 me-2">
              <ThreeDotsVertical size={24} color="#333" />
            </Button>
            <Navbar.Brand href="#" className="d-lg-none">
              <Image src="/images/Logo_Navbar.png" width={100} alt="Purple Logo" />
            </Navbar.Brand>

            <Form className="d-flex ms-auto me-3 d-none d-md-flex">
              <Form.Control
                type="search"
                placeholder="Search projects"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-secondary"><Search /></Button>
            </Form>

            <Nav className="ms-auto">
              <Nav.Link href="#" className="position-relative me-3">
                <BellFill size={20} />
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  4 <span className="visually-hidden">unread messages</span>
                </span>
              </Nav.Link>
              <Nav.Link href="#" className="position-relative me-3">
                <EnvelopeFill size={20} />
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success">
                  6 <span className="visually-hidden">unread messages</span>
                </span>
              </Nav.Link>
              <Dropdown align="end">
                <Dropdown.Toggle as={Nav.Link} className="d-flex align-items-center p-0">
                  <Image
                    src="https://placehold.co/30x30/8a2be2/ffffff?text=DG" // Placeholder for David Grey
                    roundedCircle
                    className="me-2"
                  />
                  <span className="d-none d-md-inline me-1">{displayName}</span> {/* Display dynamic username */}
                  <ChevronDown size={14} />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="#"><PersonFill className="me-2" /> Profile</Dropdown.Item>
                  <Dropdown.Item href="#"><GearFill className="me-2" /> Settings</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={logout}><BoxArrowRight className="me-2" /> Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Container>
        </Navbar>

        {/* Offcanvas Sidebar for smaller screens (mobile view) */}
        <Offcanvas show={showSidebar} onHide={handleCloseSidebar} responsive="lg">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>
              <Image src="/images/Logo_Navbar.png" width={120} alt="Purple Logo" />
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="d-flex flex-column">
            <div className="p-3 text-center border-bottom">
              <Image
                src="https://placehold.co/50x50/8a2be2/ffffff?text=DG" // Placeholder for David Grey
                roundedCircle
                className="mb-2"
              />
              <h5 className="mb-0">{displayName}</h5> {/* Display dynamic username */}
              <small className="text-muted">Project Manager</small>
            </div>
            <Nav className="flex-column p-3">
              <Nav.Link href="#" className="text-decoration-none text-dark fw-bold py-2">
                <HouseDoorFill className="me-2" />Dashboard
              </Nav.Link>
              <Nav.Link href="#" className="text-decoration-none text-secondary py-2">
                <BarChartFill className="me-2" />Basic UI Elements
              </Nav.Link>
              <Nav.Link href="#" className="text-decoration-none text-secondary py-2">
                <GridFill className="me-2" />Form Elements
              </Nav.Link>
              <Nav.Link href="#" className="text-decoration-none text-secondary py-2">
                <Table className="me-2" />Tables
              </Nav.Link>
              <Nav.Link href="#" className="text-decoration-none text-secondary py-2">
                <CircleFill className="me-2" />Icons
              </Nav.Link>
              <Nav.Link href="#" className="text-decoration-none text-secondary py-2">
                <GraphUp className="me-2" />Charts
              </Nav.Link>
              <Nav.Link href="#" className="text-decoration-none text-secondary py-2">
                <PersonFill className="me-2" />User Pages
              </Nav.Link>
              <Nav.Link href="#" className="text-decoration-none text-secondary py-2">
                <ExclamationCircleFill className="me-2" />Error Pages
              </Nav.Link>
              <Nav.Link href="#" className="text-decoration-none text-secondary py-2">
                <FileEarmarkFill className="me-2" />General Pages
              </Nav.Link>
              <Nav.Link href="#" className="text-decoration-none text-secondary py-2">
                <BookFill className="me-2" />Documentation
              </Nav.Link>
            </Nav>
          </Offcanvas.Body>
        </Offcanvas>

        {/* This is the actual content area where children will be rendered */}
        <div className="flex-grow-1 p-4 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
