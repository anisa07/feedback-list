import {Link} from "@chakra-ui/react";
import {useRouter} from "next/router";

interface GoBackLinkProps {
    color: string,
    title?: string
}

export const GoBackLink = (props: GoBackLinkProps) => {
    const router = useRouter();

    const goBack = () => router.back();

    return (<Link
        fontWeight="semibold"
        fontSize="12px"
        color={props.color}
        mr='0.5rem'
        display="inline-block" onClick={goBack}>
        {"<"} {props.title || " Go Back"}
    </Link>)
}
