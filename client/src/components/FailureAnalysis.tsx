import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
  Chip,
  Grid,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogContent
} from '@mui/material';
import { styled } from '@mui/material/styles';
import type {} from '@emotion/react/types/css-prop';
import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system';

// 型定義の簡略化
type StyleProps = {
  [key: string]: any;
};

type SxStyleProps = {
  sx?: StyleProps;
  style?: React.CSSProperties;
};

const StyledImage = ({ src, alt, ...props }: { src: string; alt: string; [key: string]: any }) => (
  <img
    src={src}
    alt={alt}
    style={{
      maxWidth: '100%',
      height: 'auto',
      cursor: 'pointer',
      ...props.style
    }}
    {...props}
  />
);

interface FailureData {
  timestamp: number;
  data: any;
  images: Array<{
    originalName: string;
    filename: string;
  }>;
}

interface KnowledgeDocument {
  id: string;
  filename: string;
  originalName: string;
  fileType: string;
  content: any;
  uploadedAt: string;
}

interface AnalysisResult {
  timestamp: number;
  failureId: string;
  analyzedDocuments: Array<{
    id: string;
    type: string;
    relevance: number;
  }>;
  suggestedActions: string[];
  riskLevel: string;
  estimatedResolutionTime: string;
}

const FailureAnalysis: React.FC = () => {
  const [failures, setFailures] = useState<FailureData[]>([]);
  const [knowledgeDocs, setKnowledgeDocs] = useState<KnowledgeDocument[]>([]);
  const [selectedFailure, setSelectedFailure] = useState<FailureData | null>(null);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageDialog, setImageDialog] = useState<{ open: boolean; url: string }>({
    open: false,
    url: ''
  });

  // 故障情報の取得
  useEffect(() => {
    fetchFailures();
    fetchKnowledgeDocs();
  }, []);

  const fetchFailures = async () => {
    try {
      const response = await fetch('/api/failure/list');
      const data = await response.json();
      if (data.failures) {
        setFailures(data.failures);
      }
    } catch (err) {
      setError('故障情報の取得に失敗しました');
    }
  };

  const fetchKnowledgeDocs = async () => {
    try {
      const response = await fetch('/api/knowledge');
      const data = await response.json();
      if (data.knowledge) {
        setKnowledgeDocs(data.knowledge);
      }
    } catch (err) {
      setError('技術文書の取得に失敗しました');
    }
  };

  const handleFailureSelect = (failure: FailureData) => {
    setSelectedFailure(failure);
    setAnalysisResult(null);
    setSelectedDocs([]);
  };

  const handleDocumentToggle = (docId: string) => {
    setSelectedDocs(prev =>
      prev.includes(docId)
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const handleAnalyze = async () => {
    if (!selectedFailure || selectedDocs.length === 0) {
      setError('故障情報と技術文書を選択してください');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/failure/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          failureId: selectedFailure.timestamp.toString(),
          documentIds: selectedDocs
        }),
      });

      const result = await response.json();
      if (result.success) {
        setAnalysisResult(result.result);
      } else {
        setError(result.error || '分析に失敗しました');
      }
    } catch (err) {
      setError('分析の実行に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          故障分析
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* 故障情報一覧 */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                故障情報一覧
              </Typography>
              <List>
                {failures.map((failure) => (
                  <ListItem
                    key={failure.timestamp}
                    onClick={() => handleFailureSelect(failure)}
                    sx={{ 
                      cursor: 'pointer',
                      bgcolor: selectedFailure?.timestamp === failure.timestamp ? 'action.selected' : 'inherit'
                    }}
                  >
                    <ListItemText
                      primary={new Date(failure.timestamp).toLocaleString()}
                      secondary={`機器ID: ${failure.data?.machineId || '不明'}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* 選択された故障情報の詳細 */}
          <Grid item xs={12} md={6}>
            {selectedFailure && (
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  故障詳細
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1">
                    発生日時: {new Date(selectedFailure.timestamp).toLocaleString()}
                  </Typography>
                  <Typography variant="body1">
                    機器ID: {selectedFailure.data?.machineId || '不明'}
                  </Typography>
                  <Typography variant="body1">
                    状態: {selectedFailure.data?.status || '不明'}
                  </Typography>
                </Box>

                {selectedFailure.images.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      関連画像
                    </Typography>
                    <Grid container spacing={1}>
                      {selectedFailure.images.map((image, index) => (
                        <Grid item xs={6} sm={4} key={index}>
                          <Card>
                            <CardMedia
                              component={StyledImage}
                              height="140"
                              image={`/api/failure/image/${image.filename}`}
                              alt={image.originalName}
                              onClick={() => setImageDialog({
                                open: true,
                                url: `/api/failure/image/${image.filename}`
                              })}
                              sx={{ cursor: 'pointer' }}
                            />
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Paper>
            )}
          </Grid>

          {/* 技術文書選択 */}
          {selectedFailure && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  関連技術文書の選択
                </Typography>
                <Grid container spacing={2}>
                  {knowledgeDocs.map((doc) => (
                    <Grid item xs={12} sm={6} md={4} key={doc.id}>
                      <Card
                        sx={{
                          cursor: 'pointer',
                          bgcolor: selectedDocs.includes(doc.id) ? 'action.selected' : 'background.paper'
                        }}
                        onClick={() => handleDocumentToggle(doc.id)}
                      >
                        <CardContent>
                          <Typography variant="subtitle1" noWrap>
                            {doc.originalName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            種類: {doc.fileType}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            アップロード: {new Date(doc.uploadedAt).toLocaleDateString()}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAnalyze}
                    disabled={loading || selectedDocs.length === 0}
                  >
                    {loading ? <CircularProgress size={24} /> : '分析を実行'}
                  </Button>
                </Box>
              </Paper>
            </Grid>
          )}

          {/* 分析結果 */}
          {analysisResult && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  分析結果
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1">リスクレベル</Typography>
                    <Chip
                      label={analysisResult.riskLevel}
                      color={
                        analysisResult.riskLevel === '高' ? 'error' :
                        analysisResult.riskLevel === '中' ? 'warning' : 'success'
                      }
                      sx={{ mt: 1 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1">推定解決時間</Typography>
                    <Typography variant="body1">{analysisResult.estimatedResolutionTime}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">推奨アクション</Typography>
                    <List>
                      {analysisResult.suggestedActions.map((action, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={action} />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Box>

      {/* 画像拡大ダイアログ */}
      <Dialog
        open={imageDialog.open}
        onClose={() => setImageDialog({ open: false, url: '' })}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <StyledImage src={imageDialog.url} alt="拡大画像" />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default FailureAnalysis; 