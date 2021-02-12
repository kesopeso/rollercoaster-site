FROM node:fermium-alpine AS build

ARG nextjs_environment
ARG token_contract_address
ARG presale_contract_address
ARG liquidity_lock_contract_address
ARG roll_farm_contract_address
ARG roll_eth_farm_contract_address
ARG buy_back_contract_address

ENV NEXTJS_ENVIRONMENT=${nextjs_environment}
ENV TOKEN_CONTRACT_ADDRESS=${token_contract_address}
ENV PRESALE_CONTRACT_ADDRESS=${presale_contract_address}
ENV LIQUIDITY_LOCK_CONTRACT_ADDRESS=${liquidity_lock_contract_address}
ENV ROLL_FARM_CONTRACT_ADDRESS=${up_farm_contract_address}
ENV ROLL_ETH_FARM_CONTRACT_ADDRESS=${up_eth_farm_contract_address}
ENV BUY_BACK_CONTRACT_ADDRESS=${buy_back_contract_address}

WORKDIR /app
COPY ./src ./
RUN npm install
RUN npm run build

FROM node:fermium-alpine AS production
WORKDIR /app
COPY --from=build /app .
EXPOSE 3000
CMD ["npm", "run", "start"]