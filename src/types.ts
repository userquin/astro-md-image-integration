export interface MdImageOptions {
  /**
   * The root directory of your markdown files.
   */
  root: string
  /**
   * Exclude the root directory from the output path?.
   *
   * @default false
   */
  excludeRoot?: boolean
}
