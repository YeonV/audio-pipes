export enum Parameters {
  /**
   * Defines how fast the envelope goes up, defined in seconds.
   */
  AttackTime = "attack",
  /**
   * Defines how fast the envelope goes down, defined in seconds.
   */
  ReleaseTime = "release",
}

export const ParameterDefaults: Readonly<Record<Parameters, number>> = {
  [Parameters.AttackTime]: 0.0002,
  [Parameters.ReleaseTime]: 0.0004,
};
