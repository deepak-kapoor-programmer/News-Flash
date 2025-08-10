import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FetchNews } from "../../../Networking/newsAPi";
import { useDispatch, useSelector } from "react-redux";
import { SetNews, setSingleNews } from "../../../redux/category";
import { Row, Col, Card, Button, Container } from "react-bootstrap";
import { AddBookmark, RemoveBookMark } from "../../../redux/Bookmark";
import SpinerCom from "../../../spinner";

export default function Category() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { categoryName } = useParams();
    const Data = useSelector((state) => state.Category.news);
    const BookMark = useSelector((state) => state.Bookmark);

    const handleCardClick = (item) => {
        dispatch(setSingleNews(item));
        navigate(`/news/${encodeURIComponent(item.title)}`);
    };

    function IsbookMarked(item) {
        return BookMark.some((index) => index.url === item.url);
    }

    function handleSave(item) {
        if (IsbookMarked(item)) {
            dispatch(RemoveBookMark(item));
        } else {
            dispatch(AddBookmark(item));
        }
    }

    useEffect(() => {
        const loadNews = async () => {
            try {
                setLoading(true);
                const { status, result } = await FetchNews(categoryName);
                if (status === "success") {
                    dispatch(SetNews(result.articles));
                }
            }
            catch (error) {
                console.log(error);

            }
            finally {
                setLoading(false);
            }
        };
        loadNews();
    }, [categoryName, dispatch]);

    return (
        <div style={{ marginTop: "90px" }}>
            {Data.length > 0 && (
                <marquee
                    behavior="scroll"
                    direction="left"
                    scrollamount="6"
                    style={{ backgroundColor: "#f8d7da", color: "#721c24", padding: "10px", fontWeight: "bold" }}
                >
                    "<u>Trending News</u>"  {Data
                        .slice(0, 5)
                        .map((item) => item.title)
                        .join(" 🔥 ")}
                </marquee>
            )}
            <Container >
                <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                    {Data.map((item, index) => (
                        <Col key={index}>
                            <Card >
                                {item.urlToImage ? (
                                    <div onClick={() => handleCardClick(item)}>
                                        <Card.Img
                                            variant="top"
                                            src={item.urlToImage}
                                            alt="news"

                                        />
                                    </div>
                                ) : (
                                    <div >No Image Available</div>
                                )}

                                <Card.Body className="d-flex flex-column justify-content-between">
                                    <div onClick={() => handleCardClick(item)} style={{ cursor: "pointer" }}>
                                        <Card.Title >
                                            {item.title.length > 100
                                                ? item.title.slice(0, 100) + "..."
                                                : item.title}
                                        </Card.Title>
                                        <Card.Text >
                                            {item.description
                                                ? item.description.length > 120
                                                    ? item.description.slice(0, 120) + "..."
                                                    : item.description
                                                : "No description available."}
                                        </Card.Text>
                                    </div>

                                    <Button
                                        variant={IsbookMarked(item) ? "danger" : "primary"}
                                        className="mt-3"
                                        onClick={() => handleSave(item)}
                                    >
                                        {IsbookMarked(item) ? "Remove Article" : "Save Article"}
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                    <SpinerCom loading={loading} />
                </Row>
            </Container>
        </div>
    );
}
