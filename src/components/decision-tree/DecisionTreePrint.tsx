import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';
import type { DecisionTree } from '@/types';

interface DecisionTreePrintProps {
  tree: DecisionTree;
  answers: Record<string, string>;
}

export function DecisionTreePrint({ tree, answers }: DecisionTreePrintProps) {
  const handlePrint = () => {
    const printContent = generatePrintHTML();
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleDownload = () => {
    const content = generatePrintHTML();
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `decision-tree-${tree.id}-${new Date().toISOString().split('T')[0]}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generatePrintHTML = () => {
    const answersList = Object.entries(answers).map(([nodeId, optionId]) => {
      const node = tree.nodes.find(n => n.id === nodeId);
      const option = node?.options?.find(o => o.id === optionId);
      return {
        question: node?.question || '',
        answer: option?.text || ''
      };
    });

    // Find the recommendation by tracing the last answer's nextNode
    const lastAnswerEntries = Object.entries(answers);
    let finalNode: typeof tree.nodes[0] | undefined;
    if (lastAnswerEntries.length > 0) {
      const [lastNodeId, lastOptionId] = lastAnswerEntries[lastAnswerEntries.length - 1];
      const lastNode = tree.nodes.find(n => n.id === lastNodeId);
      const lastOption = lastNode?.options?.find(o => o.id === lastOptionId);
      if (lastOption) {
        finalNode = tree.nodes.find(n => n.id === lastOption.nextNode && n.type === 'recommendation');
      }
    }

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Decision Tree - ${tree.title}</title>
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
      line-height: 1.6;
      color: #212529;
    }
    h1 {
      color: #2E5C8A;
      border-bottom: 3px solid #1B998B;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    h2 {
      color: #2E5C8A;
      margin-top: 30px;
      margin-bottom: 15px;
    }
    .metadata {
      background: #F8F9FA;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .metadata p {
      margin: 5px 0;
      color: #495057;
    }
    .question-answer {
      margin-bottom: 20px;
      padding-left: 20px;
      border-left: 3px solid #1B998B;
    }
    .question {
      font-weight: 600;
      color: #2E5C8A;
      margin-bottom: 5px;
    }
    .answer {
      color: #495057;
      margin-left: 10px;
    }
    .recommendation {
      background: #E8F5F3;
      border: 2px solid #1B998B;
      border-radius: 8px;
      padding: 20px;
      margin-top: 30px;
    }
    .recommendation h3 {
      color: #1B998B;
      margin-top: 0;
    }
    .legal-refs {
      margin-top: 20px;
      padding: 15px;
      background: #FFF;
      border-radius: 5px;
    }
    .legal-refs h4 {
      color: #2E5C8A;
      margin-top: 0;
    }
    .legal-refs ul {
      margin: 10px 0;
      padding-left: 20px;
    }
    .disclaimer {
      margin-top: 40px;
      padding: 15px;
      background: #FFF3CD;
      border: 1px solid #FFB703;
      border-radius: 5px;
      font-size: 14px;
    }
    @media print {
      body {
        padding: 20px;
      }
      .no-print {
        display: none;
      }
    }
  </style>
</head>
<body>
  <h1>${tree.title}</h1>
  
  <div class="metadata">
    <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
    <p><strong>Description:</strong> ${tree.description}</p>
    ${tree.scenarioDetails ? `
      <p><strong>Scenario Type:</strong> ${tree.scenarioDetails.type}</p>
      <p><strong>Setting:</strong> ${tree.scenarioDetails.setting}</p>
      <p><strong>Urgency:</strong> ${tree.scenarioDetails.urgency}</p>
    ` : ''}
  </div>

  <h2>Your Path Through the Decision Tree</h2>
  ${answersList.map((qa, idx) => `
    <div class="question-answer">
      <div class="question">Question ${idx + 1}: ${qa.question}</div>
      <div class="answer">→ ${qa.answer}</div>
    </div>
  `).join('')}

  ${finalNode ? `
    <div class="recommendation">
      <h3>${finalNode.title}</h3>
      <div>${finalNode.content?.replace(/\n/g, '<br>') || ''}</div>
      
      ${finalNode.legalReferences && finalNode.legalReferences.length > 0 ? `
        <div class="legal-refs">
          <h4>Legal References</h4>
          <ul>
            ${finalNode.legalReferences.map(ref => `<li>${ref}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
    </div>
  ` : ''}

  <div class="disclaimer">
    <strong>⚠️ Important Disclaimer</strong><br>
    This decision tree provides educational guidance based on therapeutic privacy principles and Ontario healthcare law (PHIPA). 
    It does not constitute legal or medical advice. For specific situations, consult with your institution's privacy officer, 
    ethics committee, or legal counsel. Generated via Therapeutic Privacy Assessment Tool.
  </div>
</body>
</html>
    `;
  };

  return (
    <div className="flex gap-3">
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrint}
        className="border-teal text-teal hover:bg-teal/10"
      >
        <Printer className="w-4 h-4 mr-2" />
        Print
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleDownload}
        className="border-teal text-teal hover:bg-teal/10"
      >
        <Download className="w-4 h-4 mr-2" />
        Download
      </Button>
    </div>
  );
}
