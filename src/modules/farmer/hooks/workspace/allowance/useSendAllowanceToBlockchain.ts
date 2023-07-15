// 4. Step
import { ChainIds } from '@modules/shared/constants'
import { shortenerAddress } from '@modules/shared/utils'
import { waitForTransaction } from '@wagmi/core'
import { Address } from 'viem'

import { TxHistoryRecordType, TxStatusType } from '../useActivityHistory'
import { BlancesResponseWithSelectedToken } from './useChooseInitialToken'

type SendAllowanceToBlockchainProps = {
	loggerFn: ({}: TxHistoryRecordType) => void
}
type SendAllowanceToBlockchainFnProps = {
	wallet: Address
	client: any
	configObj: any
	nextNonce: number
}

const getScanLink = (chainId: number, txHash: string) => {
	switch (chainId) {
		case ChainIds.ARBITRUM:
			return `https://arbiscan.io//tx/${txHash}`
		case ChainIds.BSC:
			return `https://bscscan.com/tx/${txHash}`
		case ChainIds.POLYGON:
			return `https://polygonscan.com/tx/${txHash}`
	}
}

type MessageGeneratorProps = {
	nonce: number
	source: {
		chainId: number
	}
	txHash: string
	status: 'SENT' | 'CONFIRMED'
}

// 'Sent allowance tx 118 to blockchain OR Allowance tx 118 confirmed. Scan: https://bscscan.com/tx/{HASH}',
const generateMessage = ({
	nonce,
	source,
	txHash,
	status,
}: MessageGeneratorProps): string => {
	const statusText =
		status === 'SENT'
			? `Sent allowance tx ${nonce} to blockchain`
			: `Allowance tx ${nonce} confirmed`
	return `${statusText}. Scan: <a href="${getScanLink(
		source.chainId,
		txHash,
	)}" target="_blank" className="text-blue-500">${getScanLink(
		source.chainId,
		shortenerAddress(txHash, 10, 10),
	)}</a>.`
}

export const useSendAllowanceToBlockchain = ({
	loggerFn,
}: SendAllowanceToBlockchainProps) => {
	const sendAllowanceToBlockchainFn = async ({
		wallet,
		client,
		configObj,
		nextNonce,
	}: SendAllowanceToBlockchainFnProps) => {
		console.log('=== Simulating contract...', configObj)
		const simulatedResult = await client.simulateContract(configObj)
		console.log('=== Sending allowance to blockchain...')
		const hash = await client.writeContract(simulatedResult.request)

		console.log('=== Waiting for transaction...', hash)

		loggerFn({
			timestamp: new Date(),
			wallet,
			status: TxStatusType.INFO,
			message: generateMessage({
				nonce: nextNonce,
				source: {
					chainId: configObj.chainId,
				},
				txHash: hash,
				status: 'SENT',
			}),
		})

		console.log('=== Waiting for transaction receipt...')

		const receipt = await client.waitForTransactionReceipt({
			hash,
			chainId: configObj.chainId,
		})

		console.log('=== Waiting for transaction receipt... DONE', receipt)

		loggerFn({
			timestamp: new Date(),
			wallet,
			status: TxStatusType.SUCCESS,
			message: generateMessage({
				nonce: nextNonce,
				source: {
					chainId: configObj.chainId,
				},
				txHash: hash,
				status: 'CONFIRMED',
			}),
		})
	}

	return {
		sendAllowanceToBlockchainFn,
	}
}
