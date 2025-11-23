-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributors ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentation ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_templates ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view public user profiles" ON users
    FOR SELECT USING (true);

-- Projects policies
CREATE POLICY "Anyone can view public projects" ON projects
    FOR SELECT USING (visibility = 'public');

CREATE POLICY "Project owners can view their private projects" ON projects
    FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Project members can view private projects" ON projects
    FOR SELECT USING (
        visibility = 'private' AND 
        EXISTS (
            SELECT 1 FROM project_members 
            WHERE project_id = projects.id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Authenticated users can create projects" ON projects
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Project owners can update their projects" ON projects
    FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Project admins can update projects" ON projects
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM project_members 
            WHERE project_id = projects.id AND user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Project owners can delete their projects" ON projects
    FOR DELETE USING (auth.uid() = owner_id);

-- Milestones policies
CREATE POLICY "Anyone can view milestones for public projects" ON milestones
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE id = milestones.project_id AND visibility = 'public'
        )
    );

CREATE POLICY "Project members can view milestones for private projects" ON milestones
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects p
            LEFT JOIN project_members pm ON p.id = pm.project_id
            WHERE p.id = milestones.project_id 
            AND (p.visibility = 'public' OR p.owner_id = auth.uid() OR pm.user_id = auth.uid())
        )
    );

CREATE POLICY "Project editors can create milestones" ON milestones
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects p
            LEFT JOIN project_members pm ON p.id = pm.project_id
            WHERE p.id = milestones.project_id 
            AND (p.owner_id = auth.uid() OR (pm.user_id = auth.uid() AND pm.role IN ('editor', 'admin')))
        )
    );

CREATE POLICY "Project editors can update milestones" ON milestones
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM projects p
            LEFT JOIN project_members pm ON p.id = pm.project_id
            WHERE p.id = milestones.project_id 
            AND (p.owner_id = auth.uid() OR (pm.user_id = auth.uid() AND pm.role IN ('editor', 'admin')))
        )
    );

CREATE POLICY "Project editors can delete milestones" ON milestones
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM projects p
            LEFT JOIN project_members pm ON p.id = pm.project_id
            WHERE p.id = milestones.project_id 
            AND (p.owner_id = auth.uid() OR (pm.user_id = auth.uid() AND pm.role IN ('editor', 'admin')))
        )
    );

-- Issues policies
CREATE POLICY "Anyone can view issues for public projects" ON issues
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE id = issues.project_id AND visibility = 'public'
        )
    );

CREATE POLICY "Project members can view issues for private projects" ON issues
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects p
            LEFT JOIN project_members pm ON p.id = pm.project_id
            WHERE p.id = issues.project_id 
            AND (p.visibility = 'public' OR p.owner_id = auth.uid() OR pm.user_id = auth.uid())
        )
    );

CREATE POLICY "Authenticated users can create issues for public projects" ON issues
    FOR INSERT WITH CHECK (
        auth.uid() = reporter_id AND
        EXISTS (
            SELECT 1 FROM projects 
            WHERE id = issues.project_id AND visibility = 'public'
        )
    );

CREATE POLICY "Project members can create issues for private projects" ON issues
    FOR INSERT WITH CHECK (
        auth.uid() = reporter_id AND
        EXISTS (
            SELECT 1 FROM projects p
            LEFT JOIN project_members pm ON p.id = pm.project_id
            WHERE p.id = issues.project_id 
            AND (p.owner_id = auth.uid() OR pm.user_id = auth.uid())
        )
    );

CREATE POLICY "Issue reporters can update their issues" ON issues
    FOR UPDATE USING (auth.uid() = reporter_id);

CREATE POLICY "Project editors can update issues" ON issues
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM projects p
            LEFT JOIN project_members pm ON p.id = pm.project_id
            WHERE p.id = issues.project_id 
            AND (p.owner_id = auth.uid() OR (pm.user_id = auth.uid() AND pm.role IN ('editor', 'admin')))
        )
    );

-- Contributors policies
CREATE POLICY "Anyone can view contributors for public projects" ON contributors
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE id = contributors.project_id AND visibility = 'public'
        )
    );

CREATE POLICY "Project members can view contributors for private projects" ON contributors
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects p
            LEFT JOIN project_members pm ON p.id = pm.project_id
            WHERE p.id = contributors.project_id 
            AND (p.visibility = 'public' OR p.owner_id = auth.uid() OR pm.user_id = auth.uid())
        )
    );

CREATE POLICY "Project owners can manage contributors" ON contributors
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE id = contributors.project_id AND owner_id = auth.uid()
        )
    );

CREATE POLICY "Project admins can manage contributors" ON contributors
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM project_members 
            WHERE project_id = contributors.project_id AND user_id = auth.uid() AND role = 'admin'
        )
    );

-- Documentation policies
CREATE POLICY "Anyone can view published documentation for public projects" ON documentation
    FOR SELECT USING (
        status = 'published' AND
        EXISTS (
            SELECT 1 FROM projects 
            WHERE id = documentation.project_id AND visibility = 'public'
        )
    );

CREATE POLICY "Project members can view all documentation for projects" ON documentation
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects p
            LEFT JOIN project_members pm ON p.id = pm.project_id
            WHERE p.id = documentation.project_id 
            AND (p.visibility = 'public' OR p.owner_id = auth.uid() OR pm.user_id = auth.uid())
        )
    );

CREATE POLICY "Project editors can create documentation" ON documentation
    FOR INSERT WITH CHECK (
        auth.uid() = author_id AND
        EXISTS (
            SELECT 1 FROM projects p
            LEFT JOIN project_members pm ON p.id = pm.project_id
            WHERE p.id = documentation.project_id 
            AND (p.owner_id = auth.uid() OR (pm.user_id = auth.uid() AND pm.role IN ('editor', 'admin')))
        )
    );

CREATE POLICY "Documentation authors can update their documentation" ON documentation
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Project editors can update documentation" ON documentation
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM projects p
            LEFT JOIN project_members pm ON p.id = pm.project_id
            WHERE p.id = documentation.project_id 
            AND (p.owner_id = auth.uid() OR (pm.user_id = auth.uid() AND pm.role IN ('editor', 'admin')))
        )
    );

-- Discussions policies
CREATE POLICY "Anyone can view discussions for public projects" ON discussions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE id = discussions.project_id AND visibility = 'public'
        )
    );

CREATE POLICY "Project members can view discussions for private projects" ON discussions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects p
            LEFT JOIN project_members pm ON p.id = pm.project_id
            WHERE p.id = discussions.project_id 
            AND (p.visibility = 'public' OR p.owner_id = auth.uid() OR pm.user_id = auth.uid())
        )
    );

CREATE POLICY "Anyone can create discussions for public projects" ON discussions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE id = discussions.project_id AND visibility = 'public'
        )
    );

CREATE POLICY "Project members can create discussions for private projects" ON discussions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects p
            LEFT JOIN project_members pm ON p.id = pm.project_id
            WHERE p.id = discussions.project_id 
            AND (p.owner_id = auth.uid() OR pm.user_id = auth.uid())
        )
    );

CREATE POLICY "Discussion authors can update their discussions" ON discussions
    FOR UPDATE USING (
        (author_id IS NOT NULL AND auth.uid() = author_id) OR
        (author_id IS NULL AND auth.uid()::text = author_email)
    );

CREATE POLICY "Project admins can update discussions" ON discussions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM projects p
            LEFT JOIN project_members pm ON p.id = pm.project_id
            WHERE p.id = discussions.project_id 
            AND (p.owner_id = auth.uid() OR (pm.user_id = auth.uid() AND pm.role = 'admin'))
        )
    );

-- Discussion replies policies
CREATE POLICY "Anyone can view discussion replies for public projects" ON discussion_replies
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM discussions d
            JOIN projects p ON d.project_id = p.id
            WHERE d.id = discussion_replies.discussion_id AND p.visibility = 'public'
        )
    );

CREATE POLICY "Project members can view discussion replies for private projects" ON discussion_replies
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM discussions d
            JOIN projects p ON d.project_id = p.id
            LEFT JOIN project_members pm ON p.id = pm.project_id
            WHERE d.id = discussion_replies.discussion_id 
            AND (p.visibility = 'public' OR p.owner_id = auth.uid() OR pm.user_id = auth.uid())
        )
    );

CREATE POLICY "Anyone can create discussion replies for public projects" ON discussion_replies
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM discussions d
            JOIN projects p ON d.project_id = p.id
            WHERE d.id = discussion_replies.discussion_id AND p.visibility = 'public'
        )
    );

CREATE POLICY "Project members can create discussion replies for private projects" ON discussion_replies
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM discussions d
            JOIN projects p ON d.project_id = p.id
            LEFT JOIN project_members pm ON p.id = pm.project_id
            WHERE d.id = discussion_replies.discussion_id 
            AND (p.owner_id = auth.uid() OR pm.user_id = auth.uid())
        )
    );

-- Security assessments policies
CREATE POLICY "Project members can view security assessments" ON security_assessments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects p
            LEFT JOIN project_members pm ON p.id = pm.project_id
            WHERE p.id = security_assessments.project_id 
            AND (p.owner_id = auth.uid() OR pm.user_id = auth.uid())
        )
    );

CREATE POLICY "Project editors can create security assessments" ON security_assessments
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects p
            LEFT JOIN project_members pm ON p.id = pm.project_id
            WHERE p.id = security_assessments.project_id 
            AND (p.owner_id = auth.uid() OR (pm.user_id = auth.uid() AND pm.role IN ('editor', 'admin')))
        )
    );

CREATE POLICY "Project editors can update security assessments" ON security_assessments
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM projects p
            LEFT JOIN project_members pm ON p.id = pm.project_id
            WHERE p.id = security_assessments.project_id 
            AND (p.owner_id = auth.uid() OR (pm.user_id = auth.uid() AND pm.role IN ('editor', 'admin')))
        )
    );

-- Teams policies
CREATE POLICY "Team owners can view their teams" ON teams
    FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Team members can view their teams" ON teams
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM team_members 
            WHERE team_id = teams.id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Authenticated users can create teams" ON teams
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Team owners can update their teams" ON teams
    FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Team owners can delete their teams" ON teams
    FOR DELETE USING (auth.uid() = owner_id);

-- Team members policies
CREATE POLICY "Team members can view team membership" ON team_members
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM teams 
            WHERE id = team_members.team_id 
            AND (owner_id = auth.uid() OR EXISTS (
                SELECT 1 FROM team_members tm 
                WHERE tm.team_id = teams.id AND tm.user_id = auth.uid()
            ))
        )
    );

CREATE POLICY "Team owners can manage team members" ON team_members
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM teams 
            WHERE id = team_members.team_id AND owner_id = auth.uid()
        )
    );

-- Project members policies
CREATE POLICY "Project members can view project membership" ON project_members
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE id = project_members.project_id 
            AND (owner_id = auth.uid() OR EXISTS (
                SELECT 1 FROM project_members pm 
                WHERE pm.project_id = projects.id AND pm.user_id = auth.uid()
            ))
        )
    );

CREATE POLICY "Project owners can manage project members" ON project_members
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE id = project_members.project_id AND owner_id = auth.uid()
        )
    );

CREATE POLICY "Project admins can manage project members" ON project_members
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM project_members 
            WHERE project_id = project_members.project_id AND user_id = auth.uid() AND role = 'admin'
        )
    );

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" ON notifications
    FOR INSERT WITH CHECK (true);

-- Project templates policies
CREATE POLICY "Anyone can view public project templates" ON project_templates
    FOR SELECT USING (is_public = true);

CREATE POLICY "Template creators can view their private templates" ON project_templates
    FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Authenticated users can create project templates" ON project_templates
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Template creators can update their templates" ON project_templates
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Template creators can delete their templates" ON project_templates
    FOR DELETE USING (auth.uid() = created_by);

