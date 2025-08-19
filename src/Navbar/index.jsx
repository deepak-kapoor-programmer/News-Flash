import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Badge } from 'react-bootstrap';
import {  useSelector } from 'react-redux';
import { useEffect, useState } from 'react';


export default function NavBar() {
   
    const [currentTime, setCurrentTime] = useState(new Date());
    const counter = useSelector((state) => state.Bookmark);

    const categories = [
        "general",
        "business",
        "entertainment",
        "health",
        "science",
        "sports",
        "technology"
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer); // cleanup on unmount
    }, []);

    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary shadow-sm fixed-top py-3">
                <Container fluid>
                    <Navbar.Brand as={Link} onClick={() => {
                        if (window.location.pathname === '/') {
                            window.location.reload();
                        } else {
                            window.location.href = '/';
                        }
                    }} className="fw-bold text-primary fs-4">
                        News<span className="text-dark">Flash</span>
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav className="me-auto my-2 my-lg-0" navbarScroll>
                            <Nav.Link as={Link} to="/" className="fw-semibold px-3">
                                Home
                            </Nav.Link>

                            <Nav.Link as={Link} to="/saved-article" className="fw-semibold px-3 d-flex align-items-center gap-1">
                                Saved Articles
                                {counter.length !== 0 && (
                                    <Badge pill bg="primary" className="ms-1">
                                        {counter.length}
                                    </Badge>
                                )}
                            </Nav.Link>

                            <NavDropdown title="Categories" id="category-dropdown" className="fw-semibold px-3">
                                {categories.map((cat) => (
                                    <NavDropdown.Item
                                        as={Link}
                                        to={`/category/${cat}`}
                                        key={cat}
                                        className="text-capitalize"
                                    >
                                        {cat}
                                    </NavDropdown.Item>
                                ))}
                            </NavDropdown>
                        </Nav>

                        {/* Current time and date */}
                        <div
                            style={{
                                fontSize: "1rem",
                                fontWeight: "500",
                                background: "#f1f3f5",
                                padding: "8px 16px",
                                borderRadius: "8px",
                                marginRight: "10px",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                            }}
                        >
                            ⏰ {currentTime.toLocaleTimeString()} | 🗓️{" "}
                            {currentTime.toLocaleDateString()}
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}
