import { useState } from 'react'

export enum TxStatusType {
	INFO = 'INFO',
	SUCCESS = 'SUCCESS',
	ERROR = 'ERROR',
}

export type TxHistoryRecordType = {
	timestamp: Date
	wallet: string
	status: TxStatusType
	message: string
}

export type ChooseInitialTokenMessageProps = {
	nameOfToken: string
	network: string
	amount: string | number
}

export const useActivityHistory = () => {
	const [history, setHistory] = useState<TxHistoryRecordType[]>([])

	const addHistory = ({
		timestamp,
		wallet,
		status,
		message,
	}: TxHistoryRecordType) => {
		setHistory((history) => [
			...history,
			{ timestamp, wallet, status, message },
		])
	}

	return {
		history,
		addHistory,
	}
}
