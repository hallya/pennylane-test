import { ReactNode, createContext, useContext, useRef } from 'react'
import OpenAPIClientAxios from 'openapi-client-axios'
import { Client } from '../../domain/types/api'
import definition from '../../domain/types/schema.json'

interface ApiContextState {
  client: Client | undefined
}

const ApiContext = createContext<ApiContextState>({
  client: undefined,
})

interface ApiProviderProps {
  url: string
  token: string
  children?: ReactNode
}

export const ApiProvider: React.FC<ApiProviderProps> = ({
  url,
  token,
  children,
}) => {
  const apiRef = useRef(
    new OpenAPIClientAxios({
      /* @ts-expect-error - Definition is generated and may not match exact typing */
      definition,
      withServer: { url },
      axiosConfigDefaults: {
        headers: {
          'X-SESSION': token,
        },
      },
    })
  )
  const clientRef = useRef(apiRef.current.initSync<Client>())

  return (
    <ApiContext.Provider value={{ client: clientRef.current }}>
      {children}
    </ApiContext.Provider>
  )
}

export const useApi = () => {
  const { client } = useContext(ApiContext)

  if (!client) {
    throw new Error('A client API must be defined')
  }

  return client
}
