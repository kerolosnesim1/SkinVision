using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SkinVision.Application.DTOs
{
    public class ChangePasswordDto
    {
       public string CurrentPassword { get; set; } = null!;
       public string NewPassword { get; set; } = null!;
    }
}
