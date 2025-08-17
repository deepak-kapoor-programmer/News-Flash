import {
    PropagateLoader
} from "react-spinners";
export default function SpinerCom(props) {
    return (
        <PropagateLoader
            className="mx-auto"
            color="navy"
            loading={props.loading}
            size={10}
            aria-label="Loading Spinner"
            data-testid="loader"
        />
    );
}