export type TopicValue<ValueType> =
  | { state: 'no-value' }
  | { state: 'parse-failure' }
  | { state: 'value'; value: ValueType }

export function extractTopicValue<ValueType, OutValue>(
  topicValue: TopicValue<ValueType>,
  defaultValue: OutValue,
  errorValue: OutValue,
): ValueType | OutValue {
  switch (topicValue.state) {
    case 'no-value':
      return defaultValue
    case 'parse-failure':
      return errorValue
    case 'value':
      return topicValue.value
  }
}
