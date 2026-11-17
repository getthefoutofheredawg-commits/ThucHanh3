using System.ComponentModel.DataAnnotations;

namespace SmartStayApi.Models;

public class Room
{
    public int Id { get; set; }

    [Required]
    [MaxLength(120)]
    public string Title { get; set; } = string.Empty;

    [Range(0, 100000000)]
    public decimal Price { get; set; }

    [Range(1, 500)]
    public double Area { get; set; }

    [Required]
    [MaxLength(200)]
    public string Address { get; set; } = string.Empty;

    public bool IsAvailable { get; set; } = true;

    public int OwnerId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
