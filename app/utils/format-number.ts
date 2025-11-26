// It will be available as randomEntry() (camelCase of file name without extension)
export default function (val: number, radix: number, width: number) : string {
    return val.toString(radix).padStart(width, '0').toUpperCase()
}
