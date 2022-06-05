import { useToast } from '@chakra-ui/react'
import {useRouter} from "next/router";

export const useErrorHandlerHook = () => {
    const router = useRouter();
    const toast = useToast();

    const handleErrorMessage = (message: string) => (
        toast({
            title: message,
            status: 'error',
            isClosable: true,
        })
    )

    const handleErrorByCode = async (errorCode: number) => {
        switch (errorCode) {
            case 403:
                handleErrorMessage('Token expired or user not auth');
                if (router.pathname !== "/login") {
                    return router.push("/login");
                }
                break;
            case 404:
                handleErrorMessage('Not found');
                if (router.pathname !== "/login") {
                    return router.push("/login");
                }
                break;
            case 400:
                handleErrorMessage('Sent data is incorrect');
                break;
        }
    }

    return { handleErrorByCode, handleErrorMessage};
}
