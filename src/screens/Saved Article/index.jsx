import { useSelector, useDispatch } from "react-redux";
import { RemoveBookMark } from "../../redux/Bookmark";
import { Card, Button, Row, Col } from "react-bootstrap";
import { setSingleNews } from "../../redux/category";
import { useNavigate } from "react-router-dom";
export default function SaveArticle() {
    const data = useSelector((state) => state.Bookmark);
    const dispatch = useDispatch();
    const navigate = useNavigate();

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
                <p className="text-center text-muted fs-5">
                    You haven't saved any articles yet.
                </p>
            ) : (
                <Row xs={1} md={2} lg={3} className="g-4">
                    {data.map((item, index) => (
                        <Col key={index}>
                            <Card
                                className="news-card h-100 border-0"
                                onClick={() => handleCardClick(item)}
                            >
                                {item.urlToImage ? (
                                    <Card.Img
                                        variant="top"
                                        src={item.urlToImage}
                                        alt="News"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="no-image">No Image Available</div>
                                )}

                                <Card.Body className="news-card-body">
                                    <div>
                                        <Card.Title className="news-card-title">
                                            {item.title}
                                        </Card.Title>
                                        <Card.Text className="news-card-text">
                                            {item.description || "No description available."}
                                        </Card.Text>
                                    </div>

                                    <Button
                                        variant="outline-danger"
                                        className="news-save-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemove(item);
                                        }}
                                        size="sm"
                                    >
                                        ❌ Remove
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
