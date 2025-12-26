import { Node, AppType } from "./types";

export interface GeneratedTopic {
  title: string;
  description: string;
  keyFeatures: string[];
  targetAudience: string;
  uniqueValue: string;
}

export function generateTopic(
  keywords: string[],
  selectedType: AppType,
  selectedNodes: Node[]
): GeneratedTopic {
  const keywordStr = keywords.join(", ");
  // 모바일 앱만 지원
  
  // 선택된 노드들의 제목과 요약을 종합
  const nodeTitles = selectedNodes.map((n) => n.title).join(", ");
  const nodeSummaries = selectedNodes.map((n) => n.summary).join(" ");
  
  // 주제 제목 생성
  const topicTitle = `${keywordStr} 기반 모바일 앱: ${selectedNodes[0]?.title || "통합 솔루션"}`;
  
  // 설명 생성
  const description = `${keywordStr}를 중심으로 한 모바일 앱입니다. ${selectedNodes.length}개의 핵심 아이디어를 통합하여 사용자에게 차별화된 가치를 제공합니다. ${nodeSummaries.slice(0, 100)}...`;
  
  // 핵심 기능 추출 (선택된 노드들의 제목 기반)
  const keyFeatures = selectedNodes.slice(0, 4).map((node, index) => {
    const featureNumber = index + 1;
    return `${featureNumber}. ${node.title}`;
  });
  
  // 타겟 사용자
  const targetAudience = keywords.some((k) => k.includes("학습") || k.includes("공부"))
    ? "학습 및 자기계발에 관심 있는 사용자"
    : keywords.some((k) => k.includes("소셜") || k.includes("커뮤니티"))
    ? "커뮤니티 활동을 즐기는 사용자"
    : keywords.some((k) => k.includes("비즈니스") || k.includes("판매"))
    ? "비즈니스 및 창업에 관심 있는 사용자"
    : `${keywordStr} 관련 활동을 하는 사용자`;
  
  // 차별화 포인트
  const uniqueValue = `${selectedNodes.length}개의 핵심 아이디어를 통합한 앱으로, ${keywordStr} 분야에서 독특한 접근 방식을 제공합니다.`;
  
  return {
    title: topicTitle,
    description,
    keyFeatures,
    targetAudience,
    uniqueValue,
  };
}

