import '../styles/globals.css'
import type {AppProps} from 'next/app'
import {ChakraProvider} from '@chakra-ui/react'
import {extendTheme} from '@chakra-ui/react'
import {colors} from "../styles/colors";
import { Provider } from 'react-redux';
import {store} from "../store/store";

const theme = extendTheme({
    styles: {
        global: () => ({
            body: {
                bg: colors.lightbluegray,
            },
        }),
    },
})

function MyApp({Component, pageProps}: AppProps) {
    return (
        <Provider store={store}>
            <ChakraProvider theme={theme}>
                <Component {...pageProps} />
            </ChakraProvider>
        </Provider>
    )
}

export default MyApp
