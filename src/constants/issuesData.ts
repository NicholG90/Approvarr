export const issueReasons = [
    { label: 'Audio', value: 'Audio' },
    { label: 'Subtitles', value: 'Subtitles' },
    { label: 'Video', value: 'Video' },
    { label: 'Other', value: 'Other' },
];
export enum issueType {
  VIDEO = 1,
  AUDIO = 2,
  SUBTITLES = 3,
  OTHER = 4,
}

export enum issueStatus {
  OPEN = 1,
  RESOLVED = 2,
}
