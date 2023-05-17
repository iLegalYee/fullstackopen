const Course = ({ course }) => {
    const totalExercices = course.parts.reduce((sum, parts) => sum + parts.exercises, 0)
    return (
        <div>
            <h2>{course.name}</h2>
            {course.parts.map(part =>
                <div key={part.id}>
                    <p>{part.name} {part.exercises}</p>
                </div>
            )}
            <b>Total of Exercises {totalExercices}</b>
        </div>
    )
}

export { Course }