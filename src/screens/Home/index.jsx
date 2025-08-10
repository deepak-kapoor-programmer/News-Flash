import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Card, Button, Container, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { SetDateFilter, setSingleNews, SetSearchNews, SetNews } from '../../redux/category';
import { AddBookmark, RemoveBookMark } from '../../redux/Bookmark';
import { useState, useEffect } from 'react';
import { FetchNews } from '../../Networking/newsAPi';
import SpinerCom from '../../spinner';

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [data, setdata] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tempSearchTerm, setTempSearchTerm] = useState(""); // search box ka local state
  const [selectedDate, setSelectedDate] = useState();
  const [currentTime, setCurrentTime] = useState(new Date());

  const keyword = useSelector((state) => state.Category.SearchNews);
  const dateFilteredNews = useSelector((state) => state.Category.dateFilteredNews);
  const bookmarks = useSelector((state) => state.Bookmark);
  const dataToShow = useSelector((state) => state.Category.news)

  const isBookMarked = (item) => bookmarks.some((article) => article.url === item.url);

  // First mount log
  // Fetch news when keyword changes
  async function getNewsByKeyword(searchKey) {
    try {
      console.log("Searching news for:", searchKey);
      const newsData = await FetchNews(searchKey);
      console.log("data is ", newsData.result.articles);
      console.log("data to show", dataToShow);
      
      dispatch(SetNews(newsData.result.articles || []));
      setdata(newsData.result.articles || []);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (keyword && keyword.trim() !== '') {
      getNewsByKeyword(keyword);
    }
  }, [keyword]);

  // Search button 
  const handleSearchClick = async () => {
    if (!tempSearchTerm.trim()) return;
    dispatch(SetSearchNews(tempSearchTerm)); // Redux me keyword store
    setLoading(true);
    try {
      const newsData = await FetchNews(tempSearchTerm);
      setdata(newsData.result.articles || []);
      dispatch(SetNews(newsData.result.articles || []));
      setTempSearchTerm("");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch news when date changes
  useEffect(() => {
    const loadNewsByDate = async () => {
      try {
        if (selectedDate) {
          setLoading(true);
          const res = await FetchNews("india", selectedDate);
          dispatch(SetNews(res.result.articles || []));
          console.log("date data",dataToShow);
          
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    loadNewsByDate();
  }, [selectedDate]);

  // Live clock
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Default news (on first load if no keyword/date)
  useEffect(() => {
    const loadDefaultNews = async () => {
      try {
        setLoading(true);
        const newsData = await FetchNews("india"); // Default keyword
        console.log("default data", dataToShow);
        

        setdata(newsData.result.articles || []);
        dispatch(SetNews(newsData.result.articles || []));

      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (!keyword && !selectedDate) {
      loadDefaultNews();
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
          background: "#ffffff",
          padding: "15px 0",
          borderBottom: "1px solid #dee2e6",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
          zIndex: 1000,
          position: "relative",
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
                  📅 Filter by Date:
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
                  style={{
                    maxWidth: "250px",
                    marginRight: "10px"
                  }}
                />
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleSearchClick}
                >
                  Search
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Trending marquee */}
      {dataToShow.length > 0 &&
        <marquee
          behavior="scroll"
          direction="left"
          scrollamount="6"
          style={{ backgroundColor: "#f8d7da", color: "#721c24", padding: "10px", fontWeight: "bold" }}
        >
          "<u>Trending News</u>" {dataToShow
            .slice(0, 5)
            .map((item) => item.title)
            .join(" 🔥 ")}
        </marquee>
      }

      {/* News cards */}
      <Row xs={1} md={2} lg={4} className="g-4 p-3">
        {dataToShow.map((item, index) => (
          <Col key={index}>
            <Card
              className="h-100 shadow-sm border-0 card-hover"
              style={{
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                cursor: "pointer",
              }}
              onClick={() => handleCardClick(item)}
            >
              {item.urlToImage && (
                <Card.Img
                  variant="top"
                  src={item.urlToImage}
                  alt="news"
                  style={{
                    height: "140px",
                    objectFit: "cover",
                    borderTopLeftRadius: "6px",
                    borderTopRightRadius: "6px",
                  }}
                />
              )}
              <Card.Body className="d-flex flex-column justify-content-between">
                <div>
                  <Card.Title className="fw-semibold" style={{ fontSize: "0.95rem" }}>
                    {item.title.length > 80 ? item.title.slice(0, 80) + "..." : item.title}
                  </Card.Title>
                  <Card.Text
                    className="text-muted"
                    style={{
                      fontSize: "0.85rem",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      minHeight: "3.6em"
                    }}
                  >
                    {item.description}
                  </Card.Text>
                </div>
                <Button
                  variant={isBookMarked(item) ? "outline-danger" : "outline-primary"}
                  className="mt-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSave(item);
                  }}
                  size="sm"
                >
                  {isBookMarked(item) ? "Remove" : "Save"}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
        <center><SpinerCom loading={loading} /></center>
      </Row>
    </div>
  );
}
