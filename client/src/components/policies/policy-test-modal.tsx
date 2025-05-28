import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, Loader2, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PolicyTestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  policyName: string;
}

export default function PolicyTestModal({ open, onOpenChange, policyName }: PolicyTestModalProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [testResults, setTestResults] = useState<Array<{ step: string; result: 'pass' | 'fail' | 'warning' }>>([]);

  const testSteps = [
    "初始化测试环境...",
    "验证策略语法...",
    "检查权限配置...",
    "模拟访问场景...",
    "评估安全规则...",
    "生成测试报告..."
  ];

  const runTest = async () => {
    setIsRunning(true);
    setProgress(0);
    setStatus('running');
    setTestResults([]);

    for (let i = 0; i < testSteps.length; i++) {
      setCurrentStep(testSteps[i]);
      
      // 模拟每个步骤的处理时间
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
      
      const newProgress = ((i + 1) / testSteps.length) * 100;
      setProgress(newProgress);

      // 随机生成测试结果
      const results = ['pass', 'pass', 'pass', 'warning', 'pass', 'pass'];
      setTestResults(prev => [...prev, {
        step: testSteps[i],
        result: results[i] as 'pass' | 'fail' | 'warning'
      }]);
    }

    setStatus('success');
    setIsRunning(false);
    setCurrentStep("测试完成！");
  };

  const resetTest = () => {
    setProgress(0);
    setStatus('idle');
    setCurrentStep("");
    setTestResults([]);
    setIsRunning(false);
  };

  useEffect(() => {
    if (!open) {
      resetTest();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Play className="h-5 w-5 text-blue-500" />
            策略测试 - {policyName}
          </DialogTitle>
          <DialogDescription>
            运行策略验证测试，检查配置的有效性和安全性
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 进度条 */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>测试进度</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            {currentStep && (
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                {isRunning && <Loader2 className="h-4 w-4 animate-spin" />}
                {currentStep}
              </p>
            )}
          </div>

          {/* 测试结果 */}
          {testResults.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">测试结果</h4>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {testResults.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded border">
                    <span className="text-sm">{result.step}</span>
                    <Badge variant={result.result === 'pass' ? 'default' : result.result === 'warning' ? 'secondary' : 'destructive'}>
                      {result.result === 'pass' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {result.result === 'warning' && <AlertCircle className="h-3 w-3 mr-1" />}
                      {result.result === 'fail' && <AlertCircle className="h-3 w-3 mr-1" />}
                      {result.result === 'pass' ? '通过' : result.result === 'warning' ? '警告' : '失败'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 总体状态 */}
          {status === 'success' && (
            <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">测试完成</p>
                <p className="text-sm text-green-600">策略配置验证通过，可以安全部署</p>
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              关闭
            </Button>
            {status === 'idle' && (
              <Button onClick={runTest} disabled={isRunning}>
                <Play className="h-4 w-4 mr-2" />
                开始测试
              </Button>
            )}
            {status === 'success' && (
              <Button onClick={resetTest} variant="outline">
                重新测试
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}