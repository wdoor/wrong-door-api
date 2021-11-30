import { BaseEntity, FindConditions } from "typeorm";

const combineFindParams = <E extends BaseEntity, FP = FindConditions<E>>(
	p: FP,
): FindConditions<E> =>
	Object.entries(p).reduce(
		(prev, [key, val]) => ({
			...prev,
			...(val === undefined ? {} : { [key]: val }),
		}),
		{},
	) as FindConditions<E>;

export default combineFindParams;
