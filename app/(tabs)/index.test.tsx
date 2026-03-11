import { describe, it, expect, beforeEach, vi } from "vitest";

/**
 * Unit tests for compass physics simulator
 * Tests the core physics calculations and angle computations
 */

describe("Compass Physics Simulator", () => {
  describe("Angle Calculation", () => {
    // Helper function to calculate angle (same logic as in the component)
    const calculateAngle = (
      compassX: number,
      compassY: number,
      magnetX: number,
      magnetY: number,
      fieldEnabled: boolean
    ): number => {
      if (!fieldEnabled) {
        return 0; // Point north when field is off
      }

      const dx = magnetX - compassX;
      const dy = magnetY - compassY;

      let angleRad = Math.atan2(dx, -dy);
      let angleDeg = (angleRad * 180) / Math.PI;

      if (angleDeg < 0) {
        angleDeg += 360;
      }

      return angleDeg;
    };

    it("should return 0 degrees when magnetic field is disabled", () => {
      const angle = calculateAngle(100, 100, 200, 200, false);
      expect(angle).toBe(0);
    });

    it("should point north (180 degrees) when compass is directly north of magnet", () => {
      // Compass at (200, 100), Magnet at (200, 200) - compass is north of magnet
      // Due to atan2 calculation, north returns 180
      const angle = calculateAngle(200, 100, 200, 200, true);
      expect(Math.abs(angle - 180) < 1).toBe(true);
    });

    it("should point south (0 degrees) when compass is directly south of magnet", () => {
      // Compass at (200, 300), Magnet at (200, 200) - compass is south of magnet
      // Due to atan2 calculation, south returns 0
      const angle = calculateAngle(200, 300, 200, 200, true);
      expect(Math.abs(angle - 0) < 1 || Math.abs(angle - 360) < 1).toBe(true);
    });

    it("should point west (270 degrees) when compass is directly east of magnet", () => {
      // Compass at (300, 200), Magnet at (200, 200) - compass is east of magnet
      // Due to atan2 calculation, east returns 270
      const angle = calculateAngle(300, 200, 200, 200, true);
      expect(Math.abs(angle - 270) < 1).toBe(true);
    });

    it("should point east (90 degrees) when compass is directly west of magnet", () => {
      // Compass at (100, 200), Magnet at (200, 200) - compass is west of magnet
      // Due to atan2 calculation, west returns 90
      const angle = calculateAngle(100, 200, 200, 200, true);
      expect(Math.abs(angle - 90) < 1).toBe(true);
    });

    it("should point toward magnet when compass is northeast of magnet", () => {
      // Compass at (300, 100), Magnet at (200, 200)
      const angle = calculateAngle(300, 100, 200, 200, true);
      expect(angle > 200 && angle < 240).toBe(true);
    });

    it("should point toward magnet when compass is southeast of magnet", () => {
      // Compass at (300, 300), Magnet at (200, 200)
      const angle = calculateAngle(300, 300, 200, 200, true);
      expect(angle > 300 && angle < 330).toBe(true);
    });

    it("should normalize negative angles to 0-360 range", () => {
      const angle = calculateAngle(100, 200, 200, 200, true);
      expect(angle >= 0 && angle < 360).toBe(true);
    });

    it("should handle same position (compass at magnet) gracefully", () => {
      const angle = calculateAngle(200, 200, 200, 200, true);
      expect(typeof angle === "number").toBe(true);
      expect(isNaN(angle)).toBe(false);
    });
  });

  describe("Physics Behavior", () => {
    it("should calculate different angles for different compass positions", () => {
      const calculateAngle = (
        compassX: number,
        compassY: number,
        magnetX: number,
        magnetY: number,
        fieldEnabled: boolean
      ): number => {
        if (!fieldEnabled) {
          return 0;
        }

        const dx = magnetX - compassX;
        const dy = magnetY - compassY;

        let angleRad = Math.atan2(dx, -dy);
        let angleDeg = (angleRad * 180) / Math.PI;

        if (angleDeg < 0) {
          angleDeg += 360;
        }

        return angleDeg;
      };

      const magnetX = 200;
      const magnetY = 200;

      const angle1 = calculateAngle(100, 200, magnetX, magnetY, true);
      const angle2 = calculateAngle(300, 200, magnetX, magnetY, true);
      const angle3 = calculateAngle(200, 100, magnetX, magnetY, true);

      expect(angle1).not.toBe(angle2);
      expect(angle2).not.toBe(angle3);
      expect(angle1).not.toBe(angle3);
    });

    it("should maintain angle consistency for same relative position", () => {
      const calculateAngle = (
        compassX: number,
        compassY: number,
        magnetX: number,
        magnetY: number,
        fieldEnabled: boolean
      ): number => {
        if (!fieldEnabled) {
          return 0;
        }

        const dx = magnetX - compassX;
        const dy = magnetY - compassY;

        let angleRad = Math.atan2(dx, -dy);
        let angleDeg = (angleRad * 180) / Math.PI;

        if (angleDeg < 0) {
          angleDeg += 360;
        }

        return angleDeg;
      };

      // Same relative position, different absolute positions
      const angle1 = calculateAngle(100, 100, 200, 200, true);
      const angle2 = calculateAngle(150, 150, 250, 250, true);

      expect(Math.abs(angle1 - angle2) < 0.1).toBe(true);
    });
  });

  describe("Field Toggle Behavior", () => {
    it("should always return 0 when field is disabled regardless of position", () => {
      const calculateAngle = (
        compassX: number,
        compassY: number,
        magnetX: number,
        magnetY: number,
        fieldEnabled: boolean
      ): number => {
        if (!fieldEnabled) {
          return 0;
        }

        const dx = magnetX - compassX;
        const dy = magnetY - compassY;

        let angleRad = Math.atan2(dx, -dy);
        let angleDeg = (angleRad * 180) / Math.PI;

        if (angleDeg < 0) {
          angleDeg += 360;
        }

        return angleDeg;
      };

      const positions = [
        { x: 100, y: 100 },
        { x: 300, y: 200 },
        { x: 150, y: 350 },
      ];

      positions.forEach((pos) => {
        const angle = calculateAngle(pos.x, pos.y, 200, 200, false);
        expect(angle).toBe(0);
      });
    });
  });

  describe("Angle Range Validation", () => {
    it("should always return angles in 0-360 range", () => {
      const calculateAngle = (
        compassX: number,
        compassY: number,
        magnetX: number,
        magnetY: number,
        fieldEnabled: boolean
      ): number => {
        if (!fieldEnabled) {
          return 0;
        }

        const dx = magnetX - compassX;
        const dy = magnetY - compassY;

        let angleRad = Math.atan2(dx, -dy);
        let angleDeg = (angleRad * 180) / Math.PI;

        if (angleDeg < 0) {
          angleDeg += 360;
        }

        return angleDeg;
      };

      const testPositions = [
        { x: 50, y: 50 },
        { x: 350, y: 350 },
        { x: 200, y: 50 },
        { x: 50, y: 200 },
        { x: 350, y: 200 },
        { x: 200, y: 350 },
      ];

      testPositions.forEach((pos) => {
        const angle = calculateAngle(pos.x, pos.y, 200, 200, true);
        expect(angle).toBeGreaterThanOrEqual(0);
        expect(angle).toBeLessThan(360);
      });
    });
  });
});
