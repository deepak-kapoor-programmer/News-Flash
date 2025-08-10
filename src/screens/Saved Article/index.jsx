import { useSelector, useDispatch } from "react-redux";
import { RemoveBookMark } from "../../redux/Bookmark";
import { Card, Button, Row, Col } from "react-bootstrap";
import { setSingleNews } from "../../redux/category";
import { useNavigate } from "react-router-dom";
export default function SaveArticle() {
    const data = useSelector((state) => state.Bookmark);
    const dispatch = useDispatch();
    const navigate=useNavigate();

    const handleRemove = (item) => {
        dispatch(RemoveBookMark(item));
    };
    const handleCardClick = (item) => {
        dispatch(setSingleNews(item));
        navigate(`/news/${encodeURIComponent(item.title)}`);
    };

    return (
        <div className="container" style={{ marginTop: "90px" }}>
            <h2 className="mb-4 text-center fw-bold">📌 Your Saved Articles</h2>

            {data.length === 0 ? (
                <p className="text-center text-muted fs-5">You haven't saved any articles yet.</p>
            ) : (
                <Row xs={1} md={2} lg={3} className="g-4">
                    {data.map((item, index) => (
                        <Col key={index}>
                            <Card className="h-100 shadow-sm border-0 card-hover">
                                {item.urlToImage ? (
                                    <Card.Img
                                        variant="top"
                                        src={item.urlToImage}
                                        alt="News"
                                        loading="lazy"
                                        style={{ height: "200px", objectFit: "cover" }}
                                        onClick={()=>handleCardClick(item)}
                                    />
                                ) : (
                                    <div
                                        style={{
                                            height: "200px",
                                            background: "#f0f0f0",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "14px",
                                            color: "#999"
                                        }}
                                    >
                                        No Image Available
                                    </div>
                                )}

                                <Card.Body className="d-flex flex-column justify-content-between">
                                    <div>
                                        <Card.Title className="fw-semibold" style={{ fontSize: "1rem" }}>
                                            {item.title.length > 100 ? item.title.slice(0, 100) + "..." : item.title}
                                        </Card.Title>
                                        <Card.Text className="text-muted" style={{ fontSize: "0.9rem" }}>
                                            {item.description
                                                ? item.description.length > 120
                                                    ? item.description.slice(0, 120) + "..."
                                                    : item.description
                                                : "No description available."}
                                        </Card.Text>
                                    </div>

                                    <Button
                                        variant="outline-danger"
                                        className="mt-3"
                                        onClick={() => handleRemove(item)}
                                    >
                                        ❌ Remove from Saved
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
}
