import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FetchNews } from "../../../Networking/newsAPi";
import { useDispatch, useSelector } from "react-redux";
import { SetNews, setSingleNews } from "../../../redux/category";
import { Row, Col, Card, Button, Container } from "react-bootstrap";
import { AddBookmark, RemoveBookMark } from "../../../redux/Bookmark";
import SpinerCom from "../../../spinner";
import { RiDeleteBinFill } from "react-icons/ri";
import { BsSaveFill } from "react-icons/bs";
import FadeSpiner from "../../../spinner/second-spiner";

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
    // useEffect(()=>{
    //    try {
    //     setLoading(true)
    //    } catch (error) {
    //     console.log(error);

    //    }finally{
    //     setLoading(false)

    //    }
    // })
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
    const [count, setcount] = useState(8);
    useEffect(() => {
        function handleScroll() {
            // console.log(window.innerHeight,window.scrollY,document.body.offsetHeight);
            if (window.innerHeight + window.scrollY + 10 >=
                document.body.offsetHeight && count < Data.length) {
                setLoading(true);
                setTimeout(() => {
                    setLoading(false)
                    setcount((c) => c + 4);
                }, 1000)
            }
        }
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        }
    }, [count, Data]);

    return (

        <div style={{ marginTop: "90px" }}>

            {Data.length > 0 && (
                <marquee
                    behavior="scroll"
                    direction="left"
                    scrollamount="6"
                    style={{
                        backgroundColor: "#f8d7da",
                        color: "#721c24",
                        padding: "10px",
                        fontWeight: "bold",
                    }}
                >
                    "<u>Trending News</u>"{" "}
                    {Data.slice(0, 5).map((item) => item.title).join(" 🔥 ")}
                </marquee>
            )}
            <div>
                {/* News cards */}
                <Row xs={1} md={2} lg={4} className="g-4 p-3 no-news">
                    {!loading && Data.length === 0 && (
                        <Col className="text-center">
                            <h5>No News Found</h5>
                        </Col>
                    )}
                    {loading && (
                        <div
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                background: "rgba(255, 255, 255, 0.7)",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                zIndex: 999,
                            }}
                        >
                            <FadeSpiner loading={loading} />

                        </div>
                    )}
                    {Data.slice(0, count).map((item, index) => (
                        <div className='block' key={index}>
                            <Col key={index}>
                                <Card
                                    className="news-card h-100 border-0"

                                >
                                    {item.urlToImage && (
                                        <Card.Img variant="top" src={item.urlToImage} alt="news" />
                                    )}
                                    <Card.Body className="news-card-body">
                                        <div>
                                            <Card.Title className="news-card-title">{item.title}</Card.Title>
                                            <Card.Text className="news-card-text">{item.description}</Card.Text>
                                        </div>
                                        <Row className='m-2'>
                                            <Col>
                                                <Button variant='secondary' onClick={() => handleCardClick(item)} style={{ width: "7rem", borderRadius: "5rem" }}>Read more</Button>
                                            </Col>
                                            <Col>
                                                <Button
                                                    variant={IsbookMarked(item) ? "danger" : "primary"}
                                                    className="news-save-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleSave(item);
                                                    }}
                                                    size="sm"
                                                >
                                                    {IsbookMarked(item) ? <RiDeleteBinFill /> : <BsSaveFill />}
                                                </Button>

                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </div>
                    ))}

                    <SpinerCom loading={loading} />
                </Row>
            </div>
        </div>
    );

}
