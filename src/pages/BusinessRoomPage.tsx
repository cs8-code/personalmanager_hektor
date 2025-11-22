import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Briefcase, Newspaper, HelpCircle, Send, Trash2, Edit2, X, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';

interface Post {
  id: string;
  user_id: string;
  type: 'news' | 'question';
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_email?: string;
}

interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_email?: string;
}

export default function BusinessRoomPage() {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [filter, setFilter] = useState<'all' | 'news' | 'question'>('all');

  // Create post form state
  const [postType, setPostType] = useState<'news' | 'question'>('news');
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Edit mode
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  // Check access
  useEffect(() => {
    if (!user) {
      navigate('/siportal');
      return;
    }
    if (userProfile && userProfile.employment_type !== 'selbständig') {
      alert('Dieser Bereich ist nur für selbständige Nutzer zugänglich.');
      navigate('/siportal');
      return;
    }
  }, [user, userProfile, navigate]);

  useEffect(() => {
    if (user && userProfile?.employment_type === 'selbständig') {
      fetchPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, user, userProfile]);

  useEffect(() => {
    if (selectedPost) {
      fetchComments(selectedPost.id);
    }
  }, [selectedPost]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('business_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('type', filter);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Fetch user emails from workers table
      const postsWithEmails = await Promise.all(
        (data || []).map(async (post) => {
          const { data: workerData } = await supabase
            .from('workers')
            .select('email')
            .eq('id', post.user_id)
            .maybeSingle();

          return {
            ...post,
            user_email: workerData?.email || 'Business User'
          };
        })
      );

      setPosts(postsWithEmails);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (postId: string) => {
    try {
      const { data, error } = await supabase
        .from('business_comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const commentsWithEmails = (data || []).map((comment) => ({
        ...comment,
        user_email: 'Business User'
      }));

      setComments(commentsWithEmails);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('business_posts')
        .insert([
          {
            user_id: user.id,
            type: postType,
            title: postTitle,
            content: postContent
          }
        ]);

      if (error) throw error;

      setShowCreateModal(false);
      setPostTitle('');
      setPostContent('');
      setPostType('news');
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Fehler beim Erstellen des Beitrags');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedPost || !newComment.trim()) return;

    try {
      const { error } = await supabase
        .from('business_comments')
        .insert([
          {
            post_id: selectedPost.id,
            user_id: user.id,
            content: newComment
          }
        ]);

      if (error) throw error;

      setNewComment('');
      fetchComments(selectedPost.id);
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Fehler beim Hinzufügen des Kommentars');
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Möchten Sie diesen Beitrag wirklich löschen?')) return;

    try {
      const { error } = await supabase
        .from('business_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      if (selectedPost?.id === postId) {
        setSelectedPost(null);
      }
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Fehler beim Löschen des Beitrags');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Möchten Sie diesen Kommentar wirklich löschen?')) return;

    try {
      const { error } = await supabase
        .from('business_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      if (selectedPost) {
        fetchComments(selectedPost.id);
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Fehler beim Löschen des Kommentars');
    }
  };

  const handleUpdatePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('business_posts')
        .update({ content: editContent })
        .eq('id', postId);

      if (error) throw error;

      setEditingPostId(null);
      setEditContent('');
      fetchPosts();
      if (selectedPost?.id === postId) {
        setSelectedPost({ ...selectedPost, content: editContent });
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Fehler beim Aktualisieren des Beitrags');
    }
  };

  const handleUpdateComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('business_comments')
        .update({ content: editContent })
        .eq('id', commentId);

      if (error) throw error;

      setEditingCommentId(null);
      setEditContent('');
      if (selectedPost) {
        fetchComments(selectedPost.id);
      }
    } catch (error) {
      console.error('Error updating comment:', error);
      alert('Fehler beim Aktualisieren des Kommentars');
    }
  };

  if (!user || userProfile?.employment_type !== 'selbständig') {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8 flex items-center justify-between">
            <Link
              to="/siportal"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück zur Startseite
            </Link>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Neuer Beitrag
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-400 to-blue-500 p-8">
              <div className="flex items-center space-x-4">
                <div className="bg-white rounded-xl p-3">
                  <Briefcase className="w-10 h-10 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    Business Room
                  </h1>
                  <p className="text-blue-50 mt-1">
                    Exklusiver Bereich für selbständige Subunternehmer
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-b border-gray-200">
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === 'all'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Alle
                </button>
                <button
                  onClick={() => setFilter('news')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center ${
                    filter === 'news'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Newspaper className="w-4 h-4 mr-2" />
                  Neuigkeiten
                </button>
                <button
                  onClick={() => setFilter('question')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center ${
                    filter === 'question'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Fragen
                </button>
              </div>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <p className="mt-4 text-gray-600">Laden...</p>
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Noch keine Beiträge vorhanden</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="border border-gray-200 rounded-lg p-6 hover:border-blue-400 transition-colors cursor-pointer"
                      onClick={() => setSelectedPost(post)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              post.type === 'news'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {post.type === 'news' ? (
                              <span className="flex items-center">
                                <Newspaper className="w-4 h-4 mr-1" />
                                Neuigkeit
                              </span>
                            ) : (
                              <span className="flex items-center">
                                <HelpCircle className="w-4 h-4 mr-1" />
                                Frage
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(post.created_at).toLocaleDateString('de-DE')}
                          </span>
                        </div>
                        {user?.id === post.user_id && (
                          <div className="flex space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingPostId(post.id);
                                setEditContent(post.content);
                              }}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeletePost(post.id);
                              }}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h3>
                      {editingPostId === post.id ? (
                        <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleUpdatePost(post.id)}
                              className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Speichern
                            </button>
                            <button
                              onClick={() => {
                                setEditingPostId(null);
                                setEditContent('');
                              }}
                              className="px-3 py-1 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 flex items-center"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Abbrechen
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-700 line-clamp-2">{post.content}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-3">Von: {post.user_email}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Create Post Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Neuer Beitrag</h2>
              <form onSubmit={handleCreatePost} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Beitragstyp
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="news"
                        checked={postType === 'news'}
                        onChange={(e) => setPostType(e.target.value as 'news' | 'question')}
                        className="mr-2"
                      />
                      <Newspaper className="w-4 h-4 mr-1" />
                      Neuigkeit
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="question"
                        checked={postType === 'question'}
                        onChange={(e) => setPostType(e.target.value as 'news' | 'question')}
                        className="mr-2"
                      />
                      <HelpCircle className="w-4 h-4 mr-1" />
                      Frage
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titel
                  </label>
                  <input
                    type="text"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Geben Sie einen Titel ein..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Inhalt
                  </label>
                  <textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    required
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Schreiben Sie Ihren Beitrag..."
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Abbrechen
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg disabled:opacity-50"
                  >
                    {submitting ? 'Wird erstellt...' : 'Beitrag erstellen'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Post Detail Modal */}
        {selectedPost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-xl max-w-4xl w-full my-8">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedPost.type === 'news'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {selectedPost.type === 'news' ? (
                          <span className="flex items-center">
                            <Newspaper className="w-4 h-4 mr-1" />
                            Neuigkeit
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <HelpCircle className="w-4 h-4 mr-1" />
                            Frage
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(selectedPost.created_at).toLocaleDateString('de-DE')}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedPost.title}</h2>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedPost.content}</p>
                    <p className="text-sm text-gray-500 mt-3">Von: {selectedPost.user_email}</p>
                  </div>
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 max-h-96 overflow-y-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Kommentare ({comments.length})
                </h3>
                {comments.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Noch keine Kommentare</p>
                ) : (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-gray-900">{comment.user_email}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(comment.created_at).toLocaleDateString('de-DE')} um{' '}
                              {new Date(comment.created_at).toLocaleTimeString('de-DE', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          {user?.id === comment.user_id && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setEditingCommentId(comment.id);
                                  setEditContent(comment.content);
                                }}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                        {editingCommentId === comment.id ? (
                          <div className="space-y-2">
                            <textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              rows={2}
                            />
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleUpdateComment(comment.id)}
                                className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center"
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Speichern
                              </button>
                              <button
                                onClick={() => {
                                  setEditingCommentId(null);
                                  setEditContent('');
                                }}
                                className="px-3 py-1 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 text-sm flex items-center"
                              >
                                <X className="w-4 h-4 mr-1" />
                                Abbrechen
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-200">
                <form onSubmit={handleAddComment} className="flex space-x-3">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Schreiben Sie einen Kommentar..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg flex items-center"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Senden
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
