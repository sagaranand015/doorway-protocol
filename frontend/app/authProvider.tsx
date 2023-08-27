import React from 'react'
import { useContext } from 'react';
import { useState, useEffect } from 'react';

interface AuthProviderValue {
    currentAccount: string | null;
    setCurrentAccount: () => Promise<void> | null;
    disconnectWalletHandler: () => void | null;
}

const defVal: AuthProviderValue = {
    currentAccount: "" || null,
    setCurrentAccount: () => null,
    disconnectWalletHandler: () => null,
}

const AuthContext = React.createContext<AuthProviderValue>(defVal);

declare var window: any

function AuthProvider(props: any) {

    const [currentAccount, setCurrentAccount] = useState(null)

    const checkWalletIsConnected = async () => {
        const { ethereum } = window
        if (ethereum) {
            const accounts = await ethereum.request({ method: 'eth_accounts' })
            if (accounts.length) {
                setCurrentAccount(accounts[0])
            }
        }
    }

    const connectWalletHandler = async () => {
        const { ethereum } = window
        if (!ethereum) {
            alert("Please Install Metamask")
        }
        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
            setCurrentAccount(accounts[0])
        } catch (error) {
            console.log(error)
        }
    }

    const disconnectWalletHandler = async () => {
        if (currentAccount) {
            setCurrentAccount(null);
        }
    }

    useEffect(() => {
        checkWalletIsConnected()
    }, [])

    return (
        <AuthContext.Provider value={{ currentAccount, setCurrentAccount: connectWalletHandler, disconnectWalletHandler: disconnectWalletHandler }}>
            {props.children}
        </AuthContext.Provider>
    );
}

function useAuth() {
    const authContext = useContext(AuthContext);
    return { ...authContext };
}

export { AuthProvider, useAuth };