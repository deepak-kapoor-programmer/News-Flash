import { RingLoader } from "react-spinners";
export default function SpinerCom(props) {
    return (

        <RingLoader className="mx-auto"
            color="navy"
            loading={props.loading}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
        />

    );
}