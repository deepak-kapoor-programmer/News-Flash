import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function NewsDetail() {
    const article = useSelector((state) => state.Category.singleNews);
    const navigate = useNavigate();

    if (!article) {
        return (
            <div className="text-center mt-5">
                <h3>No article selected</h3>
                <button className="btn btn-primary mt-3" onClick={() => navigate(-1)}>Go Back</button>
            </div>
        );
    }

    return (
        <div className='container' style={{ marginTop: "90px" }}>
            <h2>{article.title}</h2>
            <img
                src={article.urlToImage}
                alt="news"
                style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }}
            />
            <p className="mt-3">{article.description}</p>
            <p>{article.content}</p>
            <a href={article.url} target="_blank" >
                Read Full Article
            </a>
            {console.log(article)}

        </div>
    );
}
