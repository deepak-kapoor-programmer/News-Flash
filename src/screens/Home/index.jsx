import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Card, Button, Container, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { setSingleNews, SetSearchNews, SetNews } from '../../redux/category';
import { AddBookmark, RemoveBookMark } from '../../redux/Bookmark';
import { useState, useEffect } from 'react';
import { FetchNews } from '../../Networking/newsAPi';
import SpinerCom from '../../spinner';
import { BsSaveFill } from "react-icons/bs";
import { RiDeleteBinFill } from "react-icons/ri";
import InfiniteScroll from 'react-infinite-scroll-component';
export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const [loading, setLoading] = useState(false);
  const [tempSearchTerm, setTempSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const keyword = useSelector((state) => state.Category.SearchNews);
  const bookmarks = useSelector((state) => state.Bookmark);
  const dataToShow = useSelector((state) => state.Category.news);

  const isBookMarked = (item) => bookmarks.some((article) => article.url === item.url);

  // Fetch news based on keyword & date
  const getNews = async (searchKey, date) => {

    try {
      setLoading(true);

      const newsData = await FetchNews(searchKey || "india", date);
      const articles = newsData.result?.articles || [];

      dispatch(SetNews(articles));
    } catch (error) {
      console.log(error);
      dispatch(SetNews([])); // Clear data on error
    } finally {
      setLoading(false);
    }
  };

  // Handle Search
  const handleSearchClick = () => {
    if (!tempSearchTerm.trim()) return;
    dispatch(SetSearchNews(tempSearchTerm));
    getNews(tempSearchTerm, selectedDate);
    setTempSearchTerm("");
  };

  // When keyword or selectedDate changes, fetch data
  useEffect(() => {
    if (keyword || selectedDate) {
      getNews(keyword, selectedDate);
    } else {
      getNews("india");
    }
  }, [keyword, selectedDate]);

  // Save/Remove bookmark
  const handleSave = (item) => {
    if (isBookMarked(item)) {
      dispatch(RemoveBookMark(item));
    } else {
      dispatch(AddBookmark(item));
    }
  };

  const handleCardClick = (item) => {
    dispatch(setSingleNews(item));
    navigate(`/news/${encodeURIComponent(item.title)}`);
  };

  return (
    <div style={{ marginTop: "90px" }}>
      {/* Header */}
      <div
        style={{
          background: "#f8f9fa",
          padding: "15px 0",
          borderBottom: "1px solid #dee2e6",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Container>
          <Row className="align-items-center">
            {/* Date filter */}
            <Col xs={12} md={6} className="mb-3 mb-md-0">
              <Form.Group
                controlId="dateFilter"
                className="d-flex flex-column flex-md-row align-items-md-center"
              >
                <Form.Label className="mb-1 mb-md-0 me-md-2 fw-semibold">
                  📅 News by Date:
                </Form.Label>
                <Form.Control
                  type="date"
                  value={selectedDate}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{
                    maxWidth: "200px",
                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                    border: "1px solid #ced4da",
                    borderRadius: "6px",
                  }}
                />
              </Form.Group>
            </Col>

            {/* Search box */}
            <Col xs={12} md={6} className="text-md-end text-center">
              <Form
                className="d-flex justify-content-center justify-content-md-end"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearchClick();
                }}
              >
                <Form.Control
                  type="text"
                  placeholder="Search news..."
                  value={tempSearchTerm}
                  onChange={(e) => setTempSearchTerm(e.target.value)}
                  style={{ maxWidth: "250px", marginRight: "10px" }}
                />
                <Button type="button" variant="primary" onClick={handleSearchClick}>
                  Search
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Trending marquee */}
      {dataToShow.length > 0 && (
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
          {dataToShow.slice(0, 5).map((item) => item.title).join(" 🔥 ")}
        </marquee>
      )}


      <div>
        {/* News cards */}
        <Row xs={1} md={2} lg={4} className="g-4 p-3 no-news">
          {!loading && dataToShow.length === 0 && (
            <Col className="text-center">
              <h5>No News Found</h5>
            </Col>
          )}
          {dataToShow.map((item, index) => (
            <div className='block'>
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
                          variant={isBookMarked(item) ? "danger" : "primary"}
                          className="news-save-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSave(item);
                          }}

                          size="sm"
                        >
                          {isBookMarked(item) ? <RiDeleteBinFill /> : <BsSaveFill />}
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
