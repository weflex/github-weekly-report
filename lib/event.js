'use strict';

let _tables = [];
let _index = {};

let Event = {
  add: function(name, desc, value, describe) {
    _tables.push({
      name, desc, value, describe,
    });
    _index[name] = _tables.length - 1;
  },
  find: function(name) {
    return _tables[_index[name]];
  },
  eval: function(name) {
    return Event.find(name).value;
  },
  describe: function(data) {
    let evt = Event.find(data.type);
    if (typeof evt.describe === 'function') {
      return evt.describe(data);
    } else {
      return 'null';
    }
  }
};

function describeCommit(data) {
  return 'github.com/' + data.repo.name + '/commit/' + data.payload.head.slice(0, 7);
}
function describeIssue(data) {
  return data.repo.name + '#' + data.payload.issue.number + ' (' + data.payload.issue.title + ')';
}
function describePR(data) {
  return data.repo.name + '#' + data.payload.pull_request.number + ' (' + data.payload.pull_request.title + ')';
}

Event.add('CommitCommentEvent', 
  'Triggered when a commit comment is created.', 
  100,
  describeCommit);
Event.add('CreateEvent', 'Represents a created repository, branch, or tag.', 50,
  function(data) {
    return 'created a ' + data.payload.ref_type + ': ' + (data.payload.ref || data.repo.name);
  });
Event.add('DeleteEvent', 'Represents a deleted branch or tag.', 50,
  function(data) {
    return 'deleted a ' + data.payload.ref_type + ': ' + data.payload.ref;
  });
Event.add('DeploymentEvent', 'Represents a deployment.', 100);
Event.add('DeploymentStatusEvent', 'Represents a deployment status.', 150);
Event.add('DownloadEvent', 'Triggered when a new download is created.', 150);
Event.add('FollowEvent', 'Triggered when a user follows another user.', 5);
Event.add('ForkEvent', 'Triggered when a user forks a repository.', 50);
Event.add('GollumEvent', 'Triggered when a Wiki page is created or updated.', 100);
Event.add('IssueCommentEvent', 
  'Triggered when an issue comment is created on an issue or pull request.', 
  100,
  describeIssue);
Event.add('IssuesEvent', 
  'Triggered when an issue is assigned, unassigned, labeled, unlabeled, opened, closed, or reopened.', 
  200,
  describeIssue);
Event.add('MemberEvent', 'Triggered when a user is added as a collaborator to a repository.', 100);
Event.add('MembershipEvent', 'Triggered when a user is added or removed from a team.', 0);
Event.add('PageBuildEvent', 'Represents an attempted build of a GitHub Pages site, whether successful or not.', 100);
Event.add('PublicEvent', 'Triggered when a private repository is open sourced. Without a doubt: the best GitHub event.', 150);
Event.add('PullRequestEvent', 
  'Triggered when a pull request is assigned, unassigned, labeled, unlabeled, opened, closed, reopened, or synchronized.', 
  500,
  describePR);
Event.add('PullRequestReviewCommentEvent', 
  'Triggered when a comment is created on a portion of the unified diff of a pull request.', 
  250,
  describePR);
Event.add('PushEvent', 
  'Triggered when a repository branch is pushed to. In addition to branch pushes, webhook push events are also triggered when repository tags are pushed.', 
  200,
  describeCommit);
Event.add('ReleaseEvent', 'Triggered when a release is published.', 1000);
Event.add('RepositoryEvent', 'Triggered when a repository is created.', 500);
Event.add('StatusEvent', 'Triggered when the status of a Git commit changes.', 100);
Event.add('TeamAddEvent', 'Triggered when a repository is added to a team.', 25);
Event.add('WatchEvent', 'The WatchEvent is related to starring a repository, not watching. See this API blog post for an explanation.', 25);

module.exports = Event;