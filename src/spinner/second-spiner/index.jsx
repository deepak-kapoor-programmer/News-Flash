import {
    FadeLoader
} from "react-spinners";
export default function FadeSpiner({ loading }) {
    return (
        <FadeLoader
            className="mx-auto"
            color="grey"
            loading={loading}
            size={10}
            aria-label="Loading Spinner"
            data-testid="loader"
        />
    );
}