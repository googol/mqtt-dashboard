export type ClassNameInput =
  | ClassNameInput[]
  | undefined
  | string
  | Record<string, boolean>

export const classnames = (...classNameInput: ClassNameInput[]): string => {
  const classNames = Array.from(extractClassNames(classNameInput))
  return classNames.join(' ')
}

function* extractClassNames(classNameInput: ClassNameInput): Generator<string> {
  if (classNameInput === undefined) {
    // eslint-disable-next-line no-useless-return -- false positive
    return
  } else if (typeof classNameInput === 'string') {
    yield classNameInput
  } else if (Array.isArray(classNameInput)) {
    yield* extractClassNames(classNameInput)
  } else {
    for (const [className, enabled] of Object.entries(classNameInput)) {
      if (enabled) {
        yield className
      }
    }
  }
}
