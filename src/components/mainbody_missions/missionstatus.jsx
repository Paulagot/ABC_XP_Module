// MissionStatus.js

import React, { useState, useEffect } from 'react';

function MissionStatus() {
  const [userCourses, setUserCourses] = useState([]);
  const [criteria, setCriteria] = useState([]);

  // Fetch user courses and criteria from your API or database
  useEffect(() => {
    // Example: Fetch user courses and set state
    // const userCoursesData = fetchUserCourses();
    // setUserCourses(userCoursesData);

    // Example: Fetch criteria and set state
    // const criteriaData = fetchCriteria();
    // setCriteria(criteriaData);
  }, []);

  // Check if a user has completed a specific course
  const hasCompletedCourse = (courseId) => {
    return userCourses.some((course) => course.id === courseId);
  };

  return (
    <div>
      <h1>Mission Status</h1>
      <p>This mission is {hasCompletedCourse(1) ? 'Unlocked' : 'Locked'}</p>
      <ul>
        {criteria.map((criterion) => (
          <li key={criterion.id}>
            {criterion.name}{' '}
            {hasCompletedCourse(criterion.requiredCourseId) ? (
              <span style={{ color: 'green' }}>✓</span>
            ) : (
              <span style={{ color: 'red' }}>✗</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MissionStatus;
