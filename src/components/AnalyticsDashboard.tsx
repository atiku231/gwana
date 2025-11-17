import React, { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, Clock, Target, Brain } from 'lucide-react';
import { studyDB } from '@/src/lib/studyDB';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface AnalyticsDashboardProps {
  onBack: () => void;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ onBack }) => {
  const [totalStudyTime, setTotalStudyTime] = useState(0);
  const [weakTopics, setWeakTopics] = useState<any[]>([]);
  const [recentQuizzes, setRecentQuizzes] = useState<any[]>([]);
  const [studyBySubject, setStudyBySubject] = useState<any[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    // Total study time
    const time = await studyDB.getTotalStudyTime();
    setTotalStudyTime(time);

    // Weak topics
    const weak = await studyDB.getWeakTopics();
    setWeakTopics(weak.slice(0, 5));

    // Recent quiz performance
    const quizzes = await studyDB.getQuizResults(7);
    setRecentQuizzes(quizzes);

    // Study time by subject
    const sessions = await studyDB.getStudySessions(50);
    const subjectMap = new Map<string, number>();
    sessions.forEach(session => {
      const current = subjectMap.get(session.subject) || 0;
      subjectMap.set(session.subject, current + session.duration);
    });
    
    const subjectData = Array.from(subjectMap.entries())
      .map(([subject, minutes]) => ({ subject, minutes }))
      .sort((a, b) => b.minutes - a.minutes)
      .slice(0, 5);
    
    setStudyBySubject(subjectData);
  };

  return (
    <div className="h-full w-full bg-background overflow-y-auto custom-scrollbar">
      <div className="p-4 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={onBack}
            className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
            aria-label="Back"
          >
            <ArrowLeft size={24} className="text-primary" />
          </button>
          <h1 className="text-2xl font-bold text-foreground">Study Analytics</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={20} className="text-primary" />
              <span className="text-sm text-muted-foreground">Total Study Time</span>
            </div>
            <div className="text-3xl font-bold text-foreground">
              {Math.floor(totalStudyTime / 60)}h {totalStudyTime % 60}m
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target size={20} className="text-green-500" />
              <span className="text-sm text-muted-foreground">Avg Quiz Score</span>
            </div>
            <div className="text-3xl font-bold text-foreground">
              {recentQuizzes.length > 0
                ? Math.round(recentQuizzes.reduce((sum, q) => sum + q.score, 0) / recentQuizzes.length)
                : 0}%
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={20} className="text-blue-500" />
              <span className="text-sm text-muted-foreground">Subjects Studied</span>
            </div>
            <div className="text-3xl font-bold text-foreground">{studyBySubject.length}</div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain size={20} className="text-purple-500" />
              <span className="text-sm text-muted-foreground">Weak Topics</span>
            </div>
            <div className="text-3xl font-bold text-foreground">{weakTopics.length}</div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Study Time by Subject */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h2 className="text-lg font-semibold text-foreground mb-4">Study Time by Subject</h2>
            {studyBySubject.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={studyBySubject}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="subject" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="minutes" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-center py-8">No study data yet</p>
            )}
          </div>

          {/* Quiz Performance Trend */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h2 className="text-lg font-semibold text-foreground mb-4">Quiz Performance (Last 7)</h2>
            {recentQuizzes.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={recentQuizzes.reverse()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="subject" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-center py-8">No quiz data yet</p>
            )}
          </div>
        </div>

        {/* Weak Topics & Recommendations */}
        <div className="bg-card border border-border rounded-lg p-4">
          <h2 className="text-lg font-semibold text-foreground mb-4">Weak Topics & Recommendations</h2>
          {weakTopics.length > 0 ? (
            <div className="space-y-3">
              {weakTopics.map((topic, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-foreground">{topic.subject}</h3>
                    <p className="text-sm text-muted-foreground">
                      Average Score: {Math.round(topic.averageScore)}%
                    </p>
                  </div>
                  <button className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                    Practice More
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              No weak topics identified. Keep up the great work! 🎉
            </p>
          )}
        </div>

        {/* Personalized Recommendations */}
        <div className="mt-6 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-foreground mb-2">📊 Personalized Recommendations</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {totalStudyTime < 30 && (
              <li>• Try studying for at least 30 minutes per day for better retention</li>
            )}
            {weakTopics.length > 0 && (
              <li>• Focus on {weakTopics[0].subject} - it needs more practice</li>
            )}
            {recentQuizzes.length < 3 && (
              <li>• Take more quizzes to track your progress better</li>
            )}
            {recentQuizzes.length > 0 && recentQuizzes[0].score < 70 && (
              <li>• Review flashcards for {recentQuizzes[0].subject} before the next quiz</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
