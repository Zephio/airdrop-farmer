import { Cube, Plus } from '@phosphor-icons/react'
import { cn } from '@utils'

// TODO: Modal that creates a new group

interface EmptyGroupProps {
	classes?: string
}

export const EmptyGroup = ({ classes }: EmptyGroupProps) => {
	return (
		<button
			type="button"
			className={cn(
				'relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none',
				classes ? classes : null,
			)}
		>
			<div className="mx-auto w-full flex flex-col justify-center items-center">
				<div className="flex justify-center items-center">
					<Plus weight="bold" size={20} />
					<Cube weight="regular" size={32} />
				</div>
				<span className="mt-2 block text-sm font-semibold ">
					Add a new group
				</span>
			</div>
		</button>
	)
}
