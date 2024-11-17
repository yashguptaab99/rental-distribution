import { Controller, Logger } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { ethers } from 'ethers'

import { PayoutABI } from '@rental-distribution/core/utils'

import { ICreateDistribution } from '@rental-distribution/interfaces/distribute.types'

export interface IMessage {
	timestamp: number
	details: ICreateDistribution
	taskId: string
}

@Controller()
export class DistributeListener {
	private readonly logger = new Logger(DistributeListener.name)

	// Replace with your actual contract address, RPC URL, and private key
	private readonly PAYOUT_CONTRACT_ADDRESS = process.env.PAYOUT_CONTRACT_ADDRESS
	private readonly RPC_PROVIDER_URL = process.env.RPC_PROVIDER_URL
	private readonly PRIVATE_KEY = process.env.PRIVATE_KEY

	@MessagePattern('task-topic')
	async handleTask(@Payload() message) {
		const payload: IMessage = message.value ? JSON.parse(message.value.toString()) : message

		const distributionAmount = ethers.parseEther(payload.details.distributionAmount.toString())

		// Fetch this data from indexer
		const investors = [{ address: '0x1234', holdings: 1000 }]

		const totalHoldings = investors.reduce((acc, investor) => acc + investor.holdings, 0)

		const investorAddresses = investors.map((investor) => investor.address)
		const totalHoldingsBN = ethers.toBigInt(totalHoldings)

		const payouts = investors.map((investor) => {
			const holdingsBN = ethers.toBigInt(investor.holdings)
			const payout = (distributionAmount * holdingsBN) / totalHoldingsBN
			return payout
		})

		let totalPayout = payouts.reduce((acc, payout) => acc + payout, ethers.toBigInt(0))

		const remainder = distributionAmount - totalPayout

		if (remainder !== 0n) {
			payouts[payouts.length - 1] = payouts[payouts.length - 1] + remainder
			totalPayout = totalPayout + remainder
		}

		const provider = new ethers.JsonRpcProvider(this.RPC_PROVIDER_URL)
		const wallet = new ethers.Wallet(this.PRIVATE_KEY, provider)

		const payoutContract = new ethers.Contract(this.PAYOUT_CONTRACT_ADDRESS, PayoutABI, wallet)

		try {
			const tx = await payoutContract.distribute(
				'0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
				investorAddresses,
				payouts,
				{
					value: distributionAmount,
				}
			)
			await tx.wait()
			this.logger.debug(`Payout distribution transaction successful: ${tx.hash}`)
		} catch (error) {
			this.logger.error(`Error during payout distribution: ${error.message}`)
			throw error
		}

		this.logger.debug(
			`Received task (ID: ${payload.taskId}): Rental Yield of ${payload.details.distributionAmount} tokens successfully distributed at ${new Date(
				payload.timestamp
			).toLocaleString()} [UTC: ${new Date(payload.timestamp).toISOString()}]`
		)
	}
}
