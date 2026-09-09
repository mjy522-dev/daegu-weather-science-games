import { MissionPreset, PressureNode } from '../types';

export const MISSIONS: MissionPreset[] = [
  {
    id: 1,
    title: 'Pollinate the Sunflower!',
    koreanTitle: '해바라기를 피워라! (기본 바람길)',
    subtitle: '고기압에서 저기압으로 부는 직선 바람 만들기',
    description: '출발지 근처에 고기압(H)을, 해바라기 근처에 저기압(L)을 배치하여 곧장 뻗어나가는 시원한 바람길을 열어보세요!',
    startPosRatio: { x: 0.12, y: 0.85 },
    targetPosRatio: { x: 0.86, y: 0.18 },
    tip: '고기압(H)은 바람을 밀어내고 저기압(L)은 바람을 당깁니다. 출발지 뒤쪽에 H, 해바라기 쪽에 L을 놓아보세요!',
  },
  {
    id: 2,
    title: 'Curving Wind Highway',
    koreanTitle: '바람의 곡선 고속도로',
    subtitle: '회전하는 기류로 대각선 곡선 바람길 만들기',
    description: '북반구 고기압의 시계방향 회전과 저기압의 반시계방향 회전을 이용해 멋진 곡선 기류를 만들어보세요!',
    startPosRatio: { x: 0.12, y: 0.85 },
    targetPosRatio: { x: 0.86, y: 0.18 },
    tip: '고기압의 시계방향 회전력을 이용해 꽃가루를 위로 띄우고, 저기압이 낚아채도록 배치해보세요!',
  },
  {
    id: 3,
    title: 'Atmospheric Jet Stream',
    koreanTitle: '대기 대순환 제트기류',
    subtitle: '복합 고·저기압 기압 배치도 완성하기',
    description: '여러 개의 기압계를 연계하여 강력한 제트기류 바람길을 형성해 해바라기까지 단숨에 도달해보세요!',
    startPosRatio: { x: 0.12, y: 0.85 },
    targetPosRatio: { x: 0.86, y: 0.18 },
    tip: '중간 기착지 역할을 하는 저기압과 고기압을 번갈아 배치하면 먼 거리도 거뜬히 날아갑니다!',
  },
];

export function getDefaultNodesForMission(missionId: number, width: number = 800, height: number = 500): PressureNode[] {
  if (missionId === 1) {
    return [
      {
        id: 'node-h-1',
        type: 'H',
        x: width * 0.28,
        y: height * 0.68,
        radius: 36,
        strength: 5,
        hPa: 1024,
        rotationAngle: 0,
      },
      {
        id: 'node-l-1',
        type: 'L',
        x: width * 0.72,
        y: height * 0.32,
        radius: 36,
        strength: 5,
        hPa: 996,
        rotationAngle: 0,
      },
    ];
  } else if (missionId === 2) {
    return [
      {
        id: 'node-h-1',
        type: 'H',
        x: width * 0.22,
        y: height * 0.55,
        radius: 36,
        strength: 6,
        hPa: 1028,
        rotationAngle: 0,
      },
      {
        id: 'node-h-2',
        type: 'H',
        x: width * 0.55,
        y: height * 0.75,
        radius: 34,
        strength: 4,
        hPa: 1020,
        rotationAngle: 0,
      },
      {
        id: 'node-l-1',
        type: 'L',
        x: width * 0.76,
        y: height * 0.28,
        radius: 38,
        strength: 6,
        hPa: 992,
        rotationAngle: 0,
      },
    ];
  } else {
    return [
      {
        id: 'node-h-1',
        type: 'H',
        x: width * 0.25,
        y: height * 0.7,
        radius: 35,
        strength: 5,
        hPa: 1022,
        rotationAngle: 0,
      },
      {
        id: 'node-l-1',
        type: 'L',
        x: width * 0.46,
        y: height * 0.42,
        radius: 35,
        strength: 5,
        hPa: 998,
        rotationAngle: 0,
      },
      {
        id: 'node-h-2',
        type: 'H',
        x: width * 0.62,
        y: height * 0.58,
        radius: 35,
        strength: 5,
        hPa: 1024,
        rotationAngle: 0,
      },
      {
        id: 'node-l-2',
        type: 'L',
        x: width * 0.82,
        y: height * 0.25,
        radius: 36,
        strength: 6,
        hPa: 990,
        rotationAngle: 0,
      },
    ];
  }
}
