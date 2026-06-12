import type { Result } from '../../../electron/shared/ipc_types.ts'

export function unwrapResult<T>(result: Result<T>): T {
    if (!result.ok) throw new Error(result.error)
    return result.data
}
